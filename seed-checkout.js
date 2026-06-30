const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.shippingMethod.createMany({
    data: [
      { name: 'Standard Shipping', price: 5.99, estimatedDays: '3-5 business days', isActive: true },
      { name: 'Express Shipping', price: 15.99, estimatedDays: '1-2 business days', isActive: true },
    ],
    skipDuplicates: true
  });

  await prisma.coupon.create({
    data: {
      code: 'SPEED10',
      discountType: 'PERCENTAGE',
      discountValue: 10.00,
      isActive: true,
      usageLimit: 100
    }
  }).catch(() => console.log('Coupon already exists'));

  await prisma.coupon.create({
    data: {
      code: 'SAVE20',
      discountType: 'FIXED',
      discountValue: 20.00,
      minOrderValue: 50.00,
      isActive: true,
      usageLimit: 50
    }
  }).catch(() => console.log('Coupon already exists'));

  console.log('Seeded shipping methods and coupons.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
