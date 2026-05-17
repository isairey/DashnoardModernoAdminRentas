const nodemailer = require('nodemailer');

/**
 * EmailService - SMTP with graceful fallback
 * Works silently when SMTP is not configured (for development/testing)
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initialize();
  }

  initialize() {
    // Skip SMTP setup if not configured or if email verification is skipped
    if (process.env.SKIP_EMAIL_VERIFICATION === 'true') {
      console.log('ℹ️ Email verification skipped - email service disabled');
      return;
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('ℹ️ SMTP not configured - email features disabled');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        // Add timeout to prevent hanging
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });

      // Verify connection asynchronously (don't block startup)
      this.transporter.verify()
        .then(() => {
          this.isConfigured = true;
          console.log('✅ SMTP Connection Successful');
        })
        .catch((error) => {
          console.log('⚠️ SMTP not available:', error.message);
          this.transporter = null;
        });
    } catch (error) {
      console.log('⚠️ SMTP setup failed:', error.message);
    }
  }

  async sendEmail({ to, subject, html, text }) {
    // Silently skip if not configured
    if (!this.transporter) {
      console.log(`📧 [SKIPPED] Would send "${subject}" to ${to}`);
      return { success: true, skipped: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'RentalHub'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });

      console.log('✅ Email sent to:', to);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.log('⚠️ Email send failed:', error.message);
      // Don't throw - return success:false but don't break the flow
      return { success: false, error: error.message };
    }
  }

  async sendVerificationEmail(email, code, userName) {
    const subject = 'Verify Your Email - RentalHub';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h1 style="text-align: center; color: #000;">RentalHub</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>Your verification code is:</p>
          <div style="background: #000; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
            <p style="font-size: 42px; font-weight: bold; letter-spacing: 10px; color: #fff; margin: 0;">${code}</p>
          </div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
        </div>
      </body>
      </html>
    `;

    const text = `Your RentalHub verification code is: ${code}. Expires in 10 minutes.`;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendOTPEmail(email, otp, purpose = 'login') {
    const subject = purpose === 'signup' ? 'Your Sign Up Code - RentalHub' : 'Your Login Code - RentalHub';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h1 style="text-align: center; color: #000;">RentalHub</h1>
          <p>Your one-time password is:</p>
          <div style="background: #000; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
            <p style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #fff; margin: 0;">${otp}</p>
          </div>
          <p style="color: #666;">This code expires in 5 minutes.</p>
        </div>
      </body>
      </html>
    `;

    const text = `Your RentalHub OTP is: ${otp}. Expires in 5 minutes.`;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendWelcomeEmail(email, userName) {
    const subject = 'Welcome to RentalHub!';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #fff; border-radius: 12px; padding: 40px;">
          <h1 style="text-align: center;">Welcome to RentalHub! 🎉</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>Your email has been verified and your account is now active!</p>
          <p>You can now log in and start exploring.</p>
        </div>
      </body>
      </html>
    `;

    const text = `Welcome to RentalHub, ${userName}! Your account is now active.`;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendPasswordResetEmail(email, resetToken, userName) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset - RentalHub';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #fff; border-radius: 12px; padding: 40px;">
          <h1 style="text-align: center; color: #000;">RentalHub</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>Click below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #000; color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 8px;">Reset Password</a>
          </div>
          <p style="color: #666;">This link expires in 1 hour.</p>
        </div>
      </body>
      </html>
    `;

    const text = `Reset your password: ${resetUrl}. Expires in 1 hour.`;

    return this.sendEmail({ to: email, subject, html, text });
  }
}

module.exports = new EmailService();
