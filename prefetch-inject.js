const fs = require('fs');
const files = [
  'src/components/Header.tsx',
  'src/components/MobileBottomNav.tsx',
  'src/components/MegaMenu.tsx',
  'src/components/HeroBanner.tsx',
  'src/components/Footer.tsx',
  'src/components/SlideOutCart.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Inject prefetch={true} if it doesn't already exist in the opening Link tag
    content = content.replace(/<Link(?![^>]*prefetch)([^>]*)>/g, '<Link prefetch={true}$1>');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
