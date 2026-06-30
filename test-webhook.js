const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  console.log("Setting up DB state for testing...");
  
  await prisma.paymentGateway.upsert({
    where: { name: 'Monirize' },
    update: { merchantId: 'TEST-MERCHANT', secretKey: 'SECRET123', isActive: true },
    create: { name: 'Monirize', merchantId: 'TEST-MERCHANT', secretKey: 'SECRET123', isActive: true }
  });

  await prisma.order.upsert({
    where: { orderNumber: 'ORD-TEST-001' },
    update: { status: 'PENDING', totalAmount: 149.00, currency: 'USD' },
    create: { orderNumber: 'ORD-TEST-001', customerEmail: 'test@example.com', totalAmount: 149.00, currency: 'USD', status: 'PENDING' }
  });

  const sendWebhook = async (payload) => {
    try {
      const res = await fetch('http://localhost:3002/api/webhooks/monirize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log(`Response [${res.status}]:`, data);
      return res.status;
    } catch (e) {
      console.error("Fetch failed:", e.message);
    }
  };

  const generateSignature = (orderRef, amount, currency, status, secret) => {
    return crypto.createHmac('sha256', secret).update(`${orderRef}${amount}${currency}${status}`).digest('hex');
  };

  console.log("\n--- TEST 1: Invalid Signature ---");
  await sendWebhook({
    signature: 'bad-signature',
    merchantId: 'TEST-MERCHANT',
    orderRef: 'ORD-TEST-001',
    transactionRef: 'TXN-123',
    amount: 149.00,
    currency: 'USD',
    status: 'PAID'
  });

  console.log("\n--- TEST 2: Amount Mismatch ---");
  const badAmountSig = generateSignature('ORD-TEST-001', 9.99, 'USD', 'PAID', 'SECRET123');
  await sendWebhook({
    signature: badAmountSig,
    merchantId: 'TEST-MERCHANT',
    orderRef: 'ORD-TEST-001',
    transactionRef: 'TXN-123',
    amount: 9.99,
    currency: 'USD',
    status: 'PAID'
  });

  console.log("\n--- TEST 3: Valid Payment Callback ---");
  const validSig = generateSignature('ORD-TEST-001', 149.00, 'USD', 'PAID', 'SECRET123');
  await sendWebhook({
    signature: validSig,
    merchantId: 'TEST-MERCHANT',
    orderRef: 'ORD-TEST-001',
    transactionRef: 'TXN-123',
    amount: 149.00,
    currency: 'USD',
    status: 'PAID'
  });

  console.log("\n--- TEST 4: Duplicate/Replay Callback (Idempotency) ---");
  await sendWebhook({
    signature: validSig,
    merchantId: 'TEST-MERCHANT',
    orderRef: 'ORD-TEST-001',
    transactionRef: 'TXN-123',
    amount: 149.00,
    currency: 'USD',
    status: 'PAID'
  });

  console.log("\nTests finished.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
