'use server';

import { requireAdminSession } from '@/lib/admin-auth';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function adminReplyMessage(formData: FormData) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    const conversationIdStr = formData.get('conversationId') as string;
    const message = formData.get('message') as string;
    
    if (!message) return { success: false, error: 'Message cannot be empty' };

    const conversation = await prisma.contactConversation.findUnique({
      where: { conversationId: conversationIdStr }
    });

    if (!conversation) return { success: false, error: 'Conversation not found' };

    await prisma.$transaction([
      prisma.contactMessage.create({
        data: {
          conversationId: conversation.id,
          senderType: 'ADMIN',
          body: message
        }
      }),
      prisma.contactConversation.update({
        where: { id: conversation.id },
        data: { 
          isReadByCustomer: false,
          lastReplyAt: new Date(),
          status: 'AWAITING_CUSTOMER' 
        }
      })
    ]);

    revalidatePath(`/admin/messages`);
    revalidatePath(`/account/messages/${conversationIdStr}`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateConversationStatus(formData: FormData) {
  const _adminSession = await requireAdminSession();
  if (!_adminSession) throw new Error("Unauthorized");

  try {
    const conversationIdStr = formData.get('conversationId') as string;
    const status = formData.get('status') as any;
    
    await prisma.contactConversation.update({
      where: { conversationId: conversationIdStr },
      data: { status }
    });

    revalidatePath(`/admin/messages`);
    revalidatePath(`/account/messages/${conversationIdStr}`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
