'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { queueEmail } from '@/lib/email/queue';
import { EmailChannel } from '@prisma/client';
import { emailProvider } from '@/lib/email/provider';

export async function sendRegistrationOtp(email: string, firstName: string) {
  try {
    const existingCustomer = await prisma.customer.findUnique({ where: { email: email.toLowerCase() } });
    if (existingCustomer) return { success: false, error: 'An account with this email already exists' };

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    
    const cookieStore = await cookies();
    cookieStore.set('reg_otp', hashedOtp, { maxAge: 600, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    const html = `
      <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://sextoyslovers.com/logo-new.png" alt="SexToys Lovers Logo" style="max-width: 200px; height: auto;" />
        </div>
        <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Verify Your Email</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for registering at SexToys Lovers. Please use the following 4-digit code to verify your email address:</p>
        <div style="display: inline-block; font-size: 32px; font-weight: 900; color: #D63062; margin: 30px 0; padding: 20px 40px; background: #FFF4F7; border-radius: 12px; letter-spacing: 8px; border: 2px dashed #fbcfe8;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">If you didn't request a verification code, you can safely ignore this email.</p>
      </div>
    `;

    const emailResult = await emailProvider.sendRawEmail(email, "Your Verification Code - SexToys Lovers", html);
    
    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return { success: false, error: 'Failed to send OTP email. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to send OTP.' };
  }
}

export async function customerLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rememberMe = formData.get('rememberMe') === 'on';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!customer) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(password, customer.passwordHash);

    if (isMatch) {
      const cookieStore = await cookies();
      
      // If remember me is checked, session lasts 30 days, else session cookie (expires on close)
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 : undefined;
      
      cookieStore.set('customer_auth', customer.id.toString(), {
        path: '/',
        maxAge: maxAge,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function customerRegister(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const phone = formData.get('phone') as string;
  const acceptTerms = true;
  const marketingConsent = formData.get('marketingConsent') === 'on';
  const ageConfirmed = true;
  const submittedOtp = formData.get('otp') as string;

  if (!email || !password || !firstName || !submittedOtp) {
    return { success: false, error: 'First name, email, password, and OTP are required' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  const cookieStore = await cookies();
  const hashedOtp = cookieStore.get('reg_otp')?.value;

  if (!hashedOtp) {
    return { success: false, error: 'OTP expired or invalid. Please request a new one.' };
  }

  const isValidOtp = await bcrypt.compare(submittedOtp, hashedOtp);
  if (!isValidOtp) {
    return { success: false, error: 'Incorrect OTP code.' };
  }

  // Implicitly accepted by submitting the form

  try {
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingCustomer) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        phone,
        acceptTerms,
        marketingConsent,
        ageConfirmed,
        email: email.toLowerCase(),
        passwordHash,
        emailPreferences: {
          create: {
            globalUnsubscribe: false,
          }
        }
      },
    });

    try {
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; text-align: center;">
          <div style="margin-bottom: 30px;">
            <img src="https://sextoyslovers.com/logo-new.png" alt="SexToys Lovers Logo" style="max-width: 200px; height: auto;" />
          </div>
          <h2 style="color: #0f172a; margin: 0; font-size: 26px; font-weight: 800; margin-bottom: 20px;">Welcome to SexToys Lovers!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: left;">Hi ${customer.firstName || 'there'},</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: left;">We are thrilled to welcome you to SexToys Lovers. Your account has been successfully created.</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: left;">With your new account, you can enjoy faster checkout, track your orders, and gain access to exclusive deals tailored just for you.</p>
          <div style="margin: 30px 0;">
            <a href="https://sextoyslovers.com/account" style="display: inline-block; padding: 14px 30px; background-color: #D63062; color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 8px; font-size: 16px;">Go to My Account</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0;">If you have any questions, feel free to reply to this email. We're here to help 24/7.</p>
        </div>
      `;
      await emailProvider.sendRawEmail(customer.email, "Welcome to SexToys Lovers!", welcomeHtml);
    } catch (e) {
      console.error("Failed to send welcome email:", e);
    }

    // Automatically log in the new user
    const cookieStore = await cookies();
    cookieStore.set('customer_auth', customer.id.toString(), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'An unexpected error occurred during registration' };
  }
}

export async function customerLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('customer_auth');
}
