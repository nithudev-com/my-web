'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getMonirizeGateway() {
  let gateway = await prisma.paymentGateway.findUnique({
    where: { name: 'Monirize' }
  });

  if (!gateway) {
    gateway = await prisma.paymentGateway.create({
      data: {
        name: 'Monirize',
        isActive: false,
        isTestMode: true
      }
    });
  }

  // We should not return the secret key in plain text to the client if we want to be secure,
  // but for the admin dashboard edit form, we might return a masked version or empty,
  // and only update it if the user provides a new one.
  // For simplicity in this demo, we'll return it so they can see it, but in a real app,
  // returning it is risky. Let's return a masked version if it exists.
  return {
    id: gateway.id.toString(),
    merchantId: gateway.merchantId || '',
    publicKey: gateway.publicKey || '',
    hasSecretKey: !!gateway.secretKey,
    isActive: gateway.isActive,
    isTestMode: gateway.isTestMode
  };
}

export async function updateMonirizeGateway(formData: FormData) {
  const merchantId = formData.get('merchantId') as string;
  const publicKey = formData.get('publicKey') as string;
  const secretKey = formData.get('secretKey') as string;
  const isActive = formData.get('isActive') === 'on';
  const isTestMode = formData.get('isTestMode') === 'on';

  const updateData: any = {
    merchantId,
    publicKey,
    isActive,
    isTestMode
  };

  // Only update secret key if a new one was provided
  if (secretKey && secretKey.trim() !== '') {
    updateData.secretKey = secretKey;
  }

  await prisma.paymentGateway.update({
    where: { name: 'Monirize' },
    data: updateData
  });

  revalidatePath('/admin/settings/payment-gateways');
  return { success: true };
}
