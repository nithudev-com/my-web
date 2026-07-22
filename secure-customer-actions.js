const fs = require('fs');

const files = [
  'src/app/(frontend)/account/messages/actions.ts',
  'src/app/(frontend)/account/orders/actions.ts',
  'src/app/(frontend)/account/profile/actions.ts',
  'src/app/(frontend)/account/recently-viewed/actions.ts',
  'src/app/(frontend)/account/addresses/actions.ts',
  'src/app/(frontend)/account/wishlist/actions.ts',
];

const checkString = `
  const _customerSession = await requireCustomerSession();
  if (!_customerSession) throw new Error("Unauthorized");
`;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('requireCustomerSession')) {
    content = `import { requireCustomerSession } from '@/lib/customer-auth';\n` + content;
  }
  
  // Regex to match "export async function name(args) {"
  const regex = /export\s+async\s+function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/g;
  
  content = content.replace(regex, (match) => {
    return match + checkString;
  });
  
  fs.writeFileSync(file, content);
}
console.log('Done securing customer actions');
