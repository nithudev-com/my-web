const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brandNames = [
    "Apple", "Samsung", "Sony", "Nike", "Adidas", 
    "Puma", "Bose", "LG", "Dell", "HP", 
    "Lenovo", "Asus", "Acer", "Microsoft", "Logitech", 
    "Razer", "Corsair", "Under Armour", "Reebok", "New Balance"
  ];

  for (const name of brandNames) {
    const slug = name.toLowerCase().replace(/ /g, '-');
    const exists = await prisma.brand.findUnique({ where: { slug } });
    if (!exists) {
      await prisma.brand.create({
        data: {
          name,
          slug,
          // Unsplash placeholder logo with brand initial
          logo: `https://ui-avatars.com/api/?name=${name}&background=random&size=128&bold=true`
        }
      });
      console.log(`Created brand: ${name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
