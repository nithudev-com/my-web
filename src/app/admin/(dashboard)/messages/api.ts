'use server';
import { prisma } from '@/lib/prisma';

export async function getAdminConversations() {
  try {
    return await prisma.contactConversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });
  } catch (e) {
    return null;
  }
}
