import { cookies } from 'next/headers';
import { prisma } from './prisma';
import crypto from 'crypto';

const CUSTOMER_SESSION_COOKIE = 'customer_session';
const SESSION_MAX_AGE_DEFAULT = 60 * 60 * 24; // 1 day
const SESSION_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30; // 30 days

export async function createCustomerSession(customerId: bigint, rememberMe: boolean) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const maxAge = rememberMe ? SESSION_MAX_AGE_REMEMBER : SESSION_MAX_AGE_DEFAULT;
  const expiresAt = new Date(Date.now() + maxAge * 1000);

  await prisma.customerSession.create({
    data: {
      tokenHash,
      customerId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_SESSION_COOKIE, token, {
    path: '/',
    maxAge: maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  // Keep customer_logged_in for UI state (non-httpOnly)
  cookieStore.set('customer_logged_in', '1', {
    path: '/',
    maxAge: maxAge,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export async function requireCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const session = await prisma.customerSession.findUnique({
    where: { tokenHash },
    include: { customer: true },
  });

  if (!session) {
    return null;
  }

  if (session.revokedAt || session.expiresAt < new Date()) {
    await prisma.customerSession.delete({ where: { tokenHash } });
    return null;
  }

  // Update last used
  await prisma.customerSession.update({
    where: { tokenHash },
    data: { lastUsedAt: new Date() },
  });

  return session.customer;
}

export async function revokeCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await prisma.customerSession.delete({ where: { tokenHash } }).catch(() => {});
  }

  cookieStore.delete(CUSTOMER_SESSION_COOKIE);
  cookieStore.delete('customer_logged_in');
  cookieStore.delete('customer_auth'); // legacy
}
