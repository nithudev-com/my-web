const fs = require('fs');

const filesToUpdate = [
  'src/hooks/useCart.ts',
  'src/components/AddToCartButton.tsx',
  'src/components/BuyNowButton.tsx',
  'src/components/SlideOutCart.tsx',
  'src/components/MobileBottomNav.tsx',
  'src/components/HeaderClientIslands.tsx',
];

for (const file of filesToUpdate) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file.includes('AddToCartButton') || file.includes('BuyNowButton')) {
    content = content.replace(/useCartContext/g, 'useCartActions');
    content = content.replace(/const cart = useCartActions\(\);/g, 'const cartActions = useCartActions();');
    content = content.replace(/cart\.addItem/g, 'cartActions.addItem');
  } else if (file.includes('SlideOutCart')) {
    content = content.replace(/useCartContext/g, 'useCartState, useCartActions');
    content = content.replace(/const cart = useCartState, useCartActions\(\);/g, 'const cartState = useCartState();\n  const cartActions = useCartActions();');
    
    // Replace state usage
    content = content.replace(/cart\.isCartOpen/g, 'cartState.isCartOpen');
    content = content.replace(/cart\.items/g, 'cartState.items');
    content = content.replace(/cart\.couponCode/g, 'cartState.couponCode');
    
    // Replace action usage
    content = content.replace(/cart\.updateQuantity/g, 'cartActions.updateQuantity');
    content = content.replace(/cart\.removeItem/g, 'cartActions.removeItem');
    content = content.replace(/cart\.setCouponCode/g, 'cartActions.setCouponCode');
    content = content.replace(/cart\.closeCart/g, 'cartActions.closeCart');
    content = content.replace(/cart\.syncItems/g, 'cartActions.syncItems');
    content = content.replace(/cart\.clearCart/g, 'cartActions.clearCart');
  } else if (file.includes('HeaderClientIslands') || file.includes('MobileBottomNav')) {
    content = content.replace(/useCartContext/g, 'useCartState, useCartActions');
    content = content.replace(/const cart = useCartState, useCartActions\(\);/g, 'const cartState = useCartState();\n  const cartActions = useCartActions();');
    content = content.replace(/cart\.isLoaded/g, 'cartState.isLoaded');
    content = content.replace(/cart\.items/g, 'cartState.items');
    content = content.replace(/cart\.openCart/g, 'cartActions.openCart');
  } else if (file.includes('useCart.ts')) {
    content = content.replace(/useCartContext/g, 'useCartState');
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
