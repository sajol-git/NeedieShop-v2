import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(email: string, code: string) {
  if (!resend) {
    console.error('RESEND_API_KEY is not configured. Email sending skipped.');
    return { success: false, error: 'Email service not configured. Please check RESEND_API_KEY in secrets.' };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: 'FraudChecker <onboarding@resend.dev>', // Replace with your verified domain in production
      to: [email],
      subject: 'Verify your email - FraudChecker',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #8B183A; text-align: center;">Email Verification</h2>
          <p>Hello,</p>
          <p>Thank you for signing up for FraudChecker. Please use the following 6-digit code to verify your email address:</p>
          <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8B183A; border-radius: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 FraudChecker. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Email sending failed:', err);
    return { success: false, error: err.message };
  }
}
