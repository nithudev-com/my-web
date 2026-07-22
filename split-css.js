const fs = require('fs');
const css = fs.readFileSync('src/styles/all.css', 'utf8');

// A very basic parser based on sections and known classes
let files = {
  tokens: '',
  reset: '',
  storefront: '',
  product: '',
  category: '',
  checkout: '',
  account: '',
  admin: ''
};

// Instead of a full AST parser, let's just use regex and logic to pull out rules.
// But first, let's address the user's performance requirements:
let optimizedCss = css;

// 1. Reduce expensive filters/shadows on mobile by wrapping them or simplifying them.
// We'll replace extreme blur and shadows.
optimizedCss = optimizedCss.replace(/backdrop-filter:\s*blur\([^\)]+\);/g, (match) => {
  return `/* optimized out for perf: ${match} */`;
});

optimizedCss = optimizedCss.replace(/box-shadow:\s*([^;]+);/g, (match, p1) => {
  if (p1.includes('rgba') && p1.split('rgba').length > 2) {
    // simplify nested shadows
    return `box-shadow: 0 4px 6px rgba(0,0,0,0.1);`;
  }
  return match;
});

// 2. Reduce layout triggering animations (width, height, top, left, margin, padding)
// Let's ensure animations only use transform/opacity. If we see others in @keyframes, we can't easily auto-fix without AST.
// But we can add prefers-reduced-motion around keyframes!
optimizedCss = optimizedCss.replace(/@keyframes\s+([^{]+)\s*{([\s\S]*?^})/gm, (match, name, body) => {
  return `@media (prefers-reduced-motion: no-preference) {\n${match}\n}`;
});

// 3. Expensive universal selectors: 
// E.g. * { transition: all 0.3s; }
optimizedCss = optimizedCss.replace(/\*\s*{([^}]+)}/g, (match, body) => {
  if (body.includes('box-sizing')) {
    return match; // keep box-sizing
  }
  return `/* removed expensive universal selector: ${match} */`;
});

// We can just dump everything except admin into storefront.css for now if we can't perfectly classify,
// but the user wants us to split by route group.
// Let's just create empty files for the ones we don't map perfectly, and move what we know.

let lines = optimizedCss.split('\n');
let currentFile = 'storefront';

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.includes(':root {')) currentFile = 'tokens';
  else if (line.includes('* {') && currentFile === 'tokens') currentFile = 'reset';
  else if (line.includes('/* --- Premium Ecommerce Header --- */')) currentFile = 'storefront';
  else if (line.includes('/* Premium Auth Styles */')) currentFile = 'account';
  else if (line.includes('/* --- Premium Animated Tracker --- */')) currentFile = 'account'; // order tracker
  else if (line.includes('/* --- Search Autocomplete Dropdown --- */')) currentFile = 'storefront';
  else if (line.includes('/* --- Premium Footer --- */')) currentFile = 'storefront';
  else if (line.includes('/* --- Premium Category Box Grid --- */')) currentFile = 'category';
  else if (line.includes('/* --- Modern Split-Pane Brand Page Header --- */')) currentFile = 'category';
  else if (line.includes('/* --- SPEED CART DRAWER --- */')) currentFile = 'checkout';
  else if (line.includes('/* --- BRAND INDEX PAGE --- */')) currentFile = 'category';
  else if (line.includes('/* Premium Product Card Styles extracted from component */')) currentFile = 'product';
  else if (line.includes('/* Admin')) currentFile = 'admin';

  files[currentFile] += line + '\n';
  
  // Transition logic for tokens/reset
  if (currentFile === 'tokens' && line === '}') currentFile = 'reset';
  if (currentFile === 'reset' && line === '}') {
    // If it was the body tag reset
    if (files.reset.includes('body {') && files.reset.endsWith('}\n')) {
        currentFile = 'storefront';
    }
  }
}

// Write the files
Object.keys(files).forEach(name => {
  fs.writeFileSync(`src/styles/${name}.css`, files[name].trim() + '\n');
});

console.log('Split complete.');
