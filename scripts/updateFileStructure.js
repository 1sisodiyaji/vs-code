import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from 'fs';
import { extname, basename, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = import.meta.dirname;

const sourceDir = process.argv[2] || './';
const outputPath = join(__dirname, '../src/data/fileStructure.json');

function generateFileStructure(startPath) {
  if (!existsSync(startPath)) {
    console.error('Directory not found:', startPath);
    return null;
  }

  function processDirectory(currentPath, depth = 0, maxDepth = 20) {
    if (depth > maxDepth) {
      console.log('Maximum recursion depth reached:', currentPath);
      return null;
    }

    const stats = statSync(currentPath);
    const name = basename(currentPath);

    if (stats.isFile()) {
      const ext = extname(name).toLowerCase();
      const isAsset = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.pdf', 
                      '.ttf', '.woff', '.woff2', '.eot', '.mp4', '.webm', '.mp3', '.wav'].includes(ext);
      
      if (isAsset) {
        console.log('Skipping asset file:', currentPath);
        return null;
      }

      try {
        const content = readFileSync(currentPath, 'utf8');
        if (content.length > 10000000) {
          return {
            name,
            type: 'file',
            content: '// File too large to display (> 10MB)',
            language: ext.replace('.', '') || 'text'
          };
        }
        return {
          name,
          type: 'file',
          content,
          language: ext.replace('.', '') || 'text'
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
      const children = readdirSync(currentPath)
        .map(child => processDirectory(join(currentPath, child), depth + 1, maxDepth))
        .filter(Boolean);

      if (name === 'node_modules') {
        console.log('Skipping node_modules contents:', currentPath);
        return {
          name,
          type: 'directory',
          children: []
        };
      }

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

function rearrangeStructure(structure) {
  if (!structure) return null;

  const directories = [];
  const files = [];

  if (structure.type === 'directory') {
    structure.children.forEach(child => {
      if (child.type === 'directory') {
        directories.push(child);
      } else if (child.type === 'file') {
        files.push(child);
      }
    });

    structure.children = directories.concat(files);
  }

  if (structure.children) {
    structure.children.forEach(child => {
      if (child.type === 'directory') {
        rearrangeStructure(child);
      }
    });
  }

  return structure;
}

try {
  console.log('Generating file structure...');
  console.log('Source directory:', resolve(sourceDir));
  console.log('Output file:', outputPath);

  const structure = generateFileStructure(resolve(sourceDir));
  if (structure) {
    const rearranged = rearrangeStructure(structure);
    writeFileSync(outputPath, JSON.stringify(rearranged, null, 2));
    console.log('\nFile structure updated successfully!');
    console.log('You can now restart your development server to see the changes.');
  }
} catch (error) {
  console.error('Error updating file structure:', error.message);
  process.exit(1);
}
