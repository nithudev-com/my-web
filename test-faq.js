const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function parseFaqs(raw) {
  let arr = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (raw && typeof raw === 'object') {
    arr = Object.values(raw);
  } else if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      arr = Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch {
      return [];
    }
  }
  return arr.filter(
    (f) =>
      f &&
      typeof f === 'object' &&
      typeof f.question === 'string' && f.question.trim().length > 0 &&
      typeof f.answer === 'string' && f.answer.trim().length > 0
  );
}

async function run() {
  const product = await prisma.product.findFirst({
    where: { faq: { not: null } },
    select: { title: true, faq: true }
  });
  console.log("Raw FAQ:", JSON.stringify(product.faq, null, 2));
  console.log("Parsed FAQ:", JSON.stringify(parseFaqs(product.faq), null, 2));
}
run();
