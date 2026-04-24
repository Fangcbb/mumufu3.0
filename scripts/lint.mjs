import { readFileSync } from 'node:fs';

const files = ['index.html', 'src/main.js', 'src/styles.css', 'src/data/mock-projects.js'];

let hasError = false;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  if (content.includes('\t')) {
    console.error(`[lint] ${file}: contains tab characters`);
    hasError = true;
  }
  if (content.includes('opacity: 0;')) {
    console.error(`[lint] ${file}: contains forbidden opacity: 0`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log('[lint] basic checks passed');
