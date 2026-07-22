const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("'use server';")) {
    // If 'use server'; is not at the very top, but exists, move it.
    const lines = content.split('\n');
    const useServerIndex = lines.findIndex(l => l.trim() === "'use server';" || l.trim() === '"use server";');
    if (useServerIndex > 0) {
      lines.splice(useServerIndex, 1);
      lines.unshift("'use server';");
      
      // Keep an empty line after use server if needed
      if (lines[1] && lines[1].trim() !== '') {
        lines.splice(1, 0, '');
      }
      
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log('Fixed', filePath);
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        walkDir(fullPath);
      }
    } else if (fullPath.endsWith('actions.ts') || fullPath.endsWith('actions.js')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, '../src'));
