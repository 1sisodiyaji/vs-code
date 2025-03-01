 import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get source directory from command line argument or use default
const sourceDir = process.argv[2] || './src';
const outputPath = join(__dirname, '../src/data/fileStructure.json');

try {
  console.log('Generating file structure...');
  console.log('Source directory:', resolve(sourceDir));
  console.log('Output file:', outputPath);

  execSync(`node ${join(__dirname, '../src/utils/generateFileStructure.js')} "${sourceDir}" "${outputPath}"`, {
    stdio: 'inherit'
  });

  console.log('\nFile structure updated successfully! 🎉');
  console.log('You can now restart your development server to see the changes.');
} catch (error) {
  console.error('Error updating file structure:', error.message);
  process.exit(1);
}
