import { cookies } from 'next/headers';
import { prisma } from './prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createAdminSession(adminId: bigint) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.adminSession.create({
    data: {
      tokenHash,
      adminId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    path: '/',
    maxAge: SESSION_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { admin: true },
  });

  if (!session) {
    return null;
  }

  if (session.revokedAt || session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { tokenHash } });
    return null;
  }

  // Update last used
  await prisma.adminSession.update({
    where: { tokenHash },
    data: { lastUsedAt: new Date() },
  });

  return session.admin;
}

export async function revokeAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await prisma.adminSession.delete({ where: { tokenHash } }).catch(() => {});
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
