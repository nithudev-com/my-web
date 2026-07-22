const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

const allFiles = getFiles('src').filter(f => f.endsWith('.tsx'));

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  const styleRegex = /<style\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*(`[\s\S]*?`|"[^"]*"|'[^']*')\s*\}\}\s*(?:\/>|><\/style>)/g;
  
  let match;
  let hasChanges = false;
  
  let targetCssFile = 'storefront.css';
  if (file.includes('/account/') || file.includes('login') || file.includes('register') || file.includes('forgot-password')) targetCssFile = 'account.css';
  else if (file.includes('/checkout/') || file.includes('SlideOutCart') || file.includes('FreeShippingBar')) targetCssFile = 'checkout.css';
  else if (file.includes('/product/')) targetCssFile = 'product.css';
  else if (file.includes('/category/') || file.includes('/brand/')) targetCssFile = 'category.css';
  else if (file.includes('/admin/')) targetCssFile = 'admin.css';

  let extractedCss = '';
  
  content = content.replace(styleRegex, (fullMatch, cssContent) => {
    let rawCss = cssContent.replace(/^`|^"|^'/, '').replace(/`$|"$|'$/, '');
    
    if (rawCss.includes('${')) {
      console.log(`WARNING: Interpolated CSS found in ${file}. Not extracting.`);
      return fullMatch;
    }
    
    extractedCss += '\n' + rawCss + '\n';
    hasChanges = true;
    return ''; 
  });
  
  if (hasChanges && extractedCss.trim()) {
    fs.writeFileSync(file, content);
    fs.appendFileSync(path.join('src/styles', targetCssFile), extractedCss);
    console.log(`Extracted CSS from ${file} to ${targetCssFile}`);
  }
}
