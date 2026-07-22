const fs = require('fs');

const files = [
  'src/app/admin/(dashboard)/messages/actions.ts',
  'src/app/admin/(dashboard)/categories/actions.ts',
  'src/app/admin/(dashboard)/orders/actions.ts',
  'src/app/admin/(dashboard)/emails/templates/actions.ts',
  'src/app/admin/(dashboard)/coupons/actions.ts',
  'src/app/admin/(dashboard)/settings/payment-gateways/actions.ts',
  'src/app/admin/(dashboard)/settings/taxes/actions.ts',
  'src/app/admin/(dashboard)/settings/shipping/actions.ts',
  'src/app/admin/(dashboard)/products/actions.ts',
  'src/app/admin/(dashboard)/deals/actions.ts',
  'src/app/admin/(dashboard)/customers/actions.ts',
];

const checkString = `
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");
`;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('requireAdminSession')) {
    content = `import { requireAdminSession } from '@/lib/admin-auth';\n` + content;
  }
  
  // Regex to match "export async function name(args) {"
  // This needs to handle multiline args, but since it's simple we'll assume standard formatting
  const regex = /export\s+async\s+function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/g;
  
  content = content.replace(regex, (match) => {
    return match + checkString;
  });
  
  fs.writeFileSync(file, content);
}
console.log('Done securing actions');
