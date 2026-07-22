'use server';

import { prisma } from '@/lib/prisma';
import { createAdminSession, revokeAdminSession } from '@/lib/admin-auth';
import { rateLimit } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  // Rate limiting (max 5 attempts per 15 minutes per IP)
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
  // Avoid logging the real IP in the key directly, hash it for privacy
  const crypto = await import('crypto');
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
  
  const rateLimitResult = await rateLimit(`admin-login:${ipHash}`, 5, 900);
  if (!rateLimitResult.success) {
    return { success: false, error: 'Too many login attempts. Please try again later.' };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = bcrypt.compareSync(password, admin.passwordHash);
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  await createAdminSession(admin.id);
  
  return { success: true };
}

export async function logout() {
  await revokeAdminSession();
}
