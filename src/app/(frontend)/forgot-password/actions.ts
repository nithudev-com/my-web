'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { emailProvider } from '@/lib/email/provider';

export async function sendPasswordResetOtp(email: string) {
  try {
    const customer = await prisma.customer.findUnique({ where: { email: email.toLowerCase() } });
    if (!customer) {
      // Return success even if email doesn't exist to prevent email enumeration attacks
      return { success: true };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code for reset
    const salt = await bcrypt.genSalt(10);
    const combinedString = `${email.toLowerCase()}:${otp}`;
    const hashedToken = await bcrypt.hash(combinedString, salt);
    
    const cookieStore = await cookies();
    cookieStore.set('pwd_reset_token', hashedToken, { maxAge: 900, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://sextoyslovers.com/logo-new.png" alt="SexToys Lovers Logo" style="max-width: 200px; height: auto;" />
        </div>
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">Password Reset</h2>
        </div>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi ${customer.firstName || 'there'},</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">We received a request to reset the password for your SexToys Lovers account. Please use the following 6-digit verification code to securely reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; font-size: 36px; font-weight: 900; color: #D63062; padding: 20px 40px; background: #FFF4F7; border-radius: 12px; letter-spacing: 8px; border: 2px dashed #fbcfe8;">
            ${otp}
          </div>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">This code will expire in 15 minutes for your security.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">If you didn't request a password reset, you can safely ignore this email. Your account is secure.</p>
      </div>
    `;

    const emailResult = await emailProvider.sendRawEmail(email, "Password Reset Code - SexToys Lovers", html);
    
    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return { success: false, error: 'Failed to send reset email. Please try again later.' };
    }

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;
  const otp = formData.get('otp') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !otp || !password) {
    return { success: false, error: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long' };
  }

  const cookieStore = await cookies();
  const hashedToken = cookieStore.get('pwd_reset_token')?.value;

  if (!hashedToken) {
    return { success: false, error: 'Session expired. Please request a new reset code.' };
  }

  const combinedString = `${email.toLowerCase()}:${otp}`;
  const isValidOtp = await bcrypt.compare(combinedString, hashedToken);
  
  if (!isValidOtp) {
    return { success: false, error: 'Invalid verification code.' };
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await prisma.customer.update({
      where: { email: email.toLowerCase() },
      data: { passwordHash },
    });

    // Clear the reset token
    cookieStore.delete('pwd_reset_token');

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
