import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from 'fs';
import { extname, basename, join, resolve } from 'path';
import { fileURLToPath } from 'url';

function getLanguageFromExtension(ext) {
  const languageMap = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.css': 'css',
    '.scss': 'scss',
    '.html': 'html',
    '.json': 'json',
    '.md': 'markdown',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.go': 'go',
    '.rs': 'rust',
    '.php': 'php'
  };
  return languageMap[ext] || 'text';
}

function getAssetPlaceholder(ext) {
  const assetMap = {
    '.png': '// This is a PNG image file',
    '.jpg': '// This is a JPEG image file',
    '.jpeg': '// This is a JPEG image file',
    '.gif': '// This is a GIF image file',
    '.svg': '// This is a SVG vector image file',
    '.webp': '// This is a WebP image file',
    '.ico': '// This is an ICO icon file',
    '.pdf': '// This is a PDF document',
    '.ttf': '// This is a TrueType font file',
    '.woff': '// This is a Web Open Font Format file',
    '.woff2': '// This is a Web Open Font Format 2 file',
    '.eot': '// This is an Embedded OpenType font file',
    '.mp4': '// This is a MP4 video file',
    '.webm': '// This is a WebM video file',
    '.mp3': '// This is a MP3 audio file',
    '.wav': '// This is a WAV audio file'
  };
  return assetMap[ext] || '// Binary file';
}

function generateFileStructure(startPath) {
  if (!existsSync(startPath)) {
    console.error('Directory not found:', startPath);
    return null;
  }

  function processDirectory(currentPath, depth = 0) {
    const stats = statSync(currentPath);
    const name = basename(currentPath);

    // Allow hidden files/folders now
    // Special handling for node_modules - only show top level
    if (name === 'node_modules' && depth > 0) {
      return null;
    }

    if (stats.isFile()) {
      const ext = extname(name).toLowerCase();
      const isAsset = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.pdf', 
                      '.ttf', '.woff', '.woff2', '.eot', '.mp4', '.webm', '.mp3', '.wav'].includes(ext);
      
      if (isAsset) {
        return {
          name,
          type: 'file',
          content: getAssetPlaceholder(ext),
          language: 'text',
          isAsset: true
        };
      }

      // Skip very large text files
      if (stats.size > 1000000) {
        return {
          name,
          type: 'file',
          content: '// File too large to display (> 1MB)',
          language: getLanguageFromExtension(ext)
        };
      }

      try {
        const content = readFileSync(currentPath, 'utf8');
        return {
          name,
          type: 'file',
          content,
          language: getLanguageFromExtension(ext)
        };
      } catch (error) {
        console.error('Error reading file:', currentPath, error);
        return {
          name,
          type: 'file',
          content: '// Error reading file content',
          language: 'text'
        };
      }
    }

    if (stats.isDirectory()) {
      // Special handling for node_modules at root level
      if (name === 'node_modules' && depth === 0) {
        const packageJsons = [];
        try {
          const topLevelDirs = readdirSync(currentPath)
            .filter(item => {
              const itemPath = join(currentPath, item);
              return statSync(itemPath).isDirectory() && !item.startsWith('.');
            })
            .slice(0, 20); // Limit to first 20 packages

          topLevelDirs.forEach(dir => {
            const pkgJsonPath = join(currentPath, dir, 'package.json');
            if (existsSync(pkgJsonPath)) {
              try {
                const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
                packageJsons.push({
                  name: `${dir}/package.json`,
                  type: 'file',
                  content: JSON.stringify(pkgJson, null, 2),
                  language: 'json'
                });
              } catch (e) {
                // Skip if package.json can't be read
              }
            }
          });
        } catch (e) {
          console.error('Error reading node_modules:', e);
        }

        return {
          name,
          type: 'directory',
          children: packageJsons
        };
      }

      const children = readdirSync(currentPath)
        .map(child => processDirectory(join(currentPath, child), depth + 1))
        .filter(Boolean);

      return {
        name,
        type: 'directory',
        children
      };
    }

    return null;
  }

  const structure = processDirectory(startPath);
  return structure;
}

// Example usage:
const targetDirectory = process.argv[2] || '.';
const outputFile = process.argv[3] || 'fileStructure.json';

const structure = generateFileStructure(resolve(targetDirectory));
if (structure) {
  writeFileSync(outputFile, JSON.stringify(structure, null, 2));
  console.log('File structure generated successfully in:', outputFile);
}
