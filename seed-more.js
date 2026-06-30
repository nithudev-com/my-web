const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding realistic products...");

  // Create Electronics category
  let electronics = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  if (!electronics) {
    electronics = await prisma.category.create({
      data: { name: 'Electronics', slug: 'electronics' }
    });
  }

  // Create Fashion category
  let fashion = await prisma.category.findUnique({ where: { slug: 'fashion' } });
  if (!fashion) {
    fashion = await prisma.category.create({
      data: { name: 'Fashion', slug: 'fashion' }
    });
  }

  const products = [
    { title: 'MacBook Pro 16" M3 Max', slug: 'macbook-pro-16-m3', basePrice: 3499.00, desc: 'The most powerful MacBook.', categoryId: electronics.id, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8' },
    { title: 'iPhone 15 Pro Max Titanium', slug: 'iphone-15-pro-max', basePrice: 1199.00, desc: 'Forged in titanium.', categoryId: electronics.id, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' },
    { title: 'Sony Noise Cancelling Headphones WH-1000XM5', slug: 'sony-headphones-xm5', basePrice: 398.00, desc: 'Industry leading noise cancellation.', categoryId: electronics.id, img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb' },
    { title: 'Samsung 49" Odyssey G9 Gaming Monitor', slug: 'samsung-odyssey-g9', basePrice: 1299.00, desc: 'Immersive curved screen.', categoryId: electronics.id, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf' },
    { title: 'Men\'s Winter Puffer Jacket', slug: 'mens-winter-puffer-jacket', basePrice: 149.00, desc: 'Warm and stylish.', categoryId: fashion.id, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5' },
    { title: 'Women\'s Leather Crossbody Bag', slug: 'womens-leather-bag', basePrice: 89.00, desc: 'Premium leather.', categoryId: fashion.id, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa' },
    { title: 'Logitech MX Master 3S Wireless Mouse', slug: 'logitech-mx-master-3s', basePrice: 99.00, desc: 'Ultimate precision.', categoryId: electronics.id, img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46' },
    { title: 'Nintendo Switch OLED Model', slug: 'nintendo-switch-oled', basePrice: 349.00, desc: 'Vibrant 7-inch OLED screen.', categoryId: electronics.id, img: 'https://images.unsplash.com/photo-1578279883556-911b33b00693' }
  ];

  for (const p of products) {
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      await prisma.product.create({
        data: {
          title: p.title,
          slug: p.slug,
          description: p.desc,
          basePrice: p.basePrice,
          categoryId: p.categoryId,
          status: 'ACTIVE',
          sku: `SKU-${Math.floor(Math.random() * 10000)}`,
          mainImage: p.img
        }
      });
      console.log(`Created: ${p.title}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
