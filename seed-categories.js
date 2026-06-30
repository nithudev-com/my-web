const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Fashion', icon: '👗' },
    { name: 'Home', icon: '🛋️' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Toys', icon: '🧸' },
    { name: 'Grocery', icon: '🛒' },
    { name: 'Automotive', icon: '🚗' },
    { name: 'Pets', icon: '🐕' },
    { name: 'Health', icon: '💊' },
    { name: 'Books', icon: '📚' },
    { name: 'Garden', icon: '🌱' },
    { name: 'Jewelry', icon: '💎' },
    { name: 'Office', icon: '📎' },
    { name: 'Music', icon: '🎸' },
    { name: 'Travel', icon: '✈️' }
  ];

  for (const c of cats) {
    const slug = c.name.toLowerCase().replace(/ /g, '-');
    const exists = await prisma.category.findUnique({ where: { slug } });
    if (!exists) {
      await prisma.category.create({
        data: {
          name: c.name,
          slug: slug,
          image: c.icon // We'll store the emoji in the image field as a placeholder
        }
      });
      console.log(`Created category: ${c.name}`);
    } else {
       // update image to be the emoji just in case
       await prisma.category.update({
         where: { slug },
         data: { image: c.icon }
       });
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
