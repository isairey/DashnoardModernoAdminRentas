#!/usr/bin/env node

/**
 * SMTP Configuration Test Script
 * Run: node test-smtp.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

async function testSMTP() {
  console.log(`\n${colors.cyan}=== SMTP Configuration Test ===${colors.reset}\n`);
  
  // Check environment variables
  console.log('1. Checking environment variables...');
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.log(`${colors.red}❌ Missing environment variables: ${missing.join(', ')}${colors.reset}`);
    console.log(`\n${colors.yellow}Run: node setup-smtp.js${colors.reset}\n`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ All environment variables present${colors.reset}`);
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`   SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM}\n`);
  
  // Create transporter
  console.log('2. Creating SMTP transporter...');
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  console.log(`${colors.green}✅ Transporter created${colors.reset}\n`);
  
  // Verify connection
  console.log('3. Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log(`${colors.green}✅ SMTP connection successful${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}❌ SMTP connection failed: ${error.message}${colors.reset}\n`);
    console.log('Common issues:');
    console.log('- Wrong SMTP credentials');
    console.log('- Firewall blocking port 587');
    console.log('- Gmail: Need App Password (not regular password)');
    console.log('- SendGrid: Use "apikey" as username\n');
    process.exit(1);
  }
  
  // Send test email
  console.log('4. Sending test email...');
  const testEmail = process.env.SMTP_USER;
  
  try {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'RentalHub'} <${process.env.EMAIL_FROM}>`,
      to: testEmail,
      subject: 'SMTP Test - RentalHub',
      text: 'This is a test email from RentalHub. If you received this, your SMTP configuration is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ SMTP Test Successful!</h2>
          <p>This is a test email from RentalHub.</p>
          <p>If you received this, your SMTP configuration is working correctly!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            SMTP Host: ${process.env.SMTP_HOST}<br>
            From: ${process.env.EMAIL_FROM}
          </p>
        </div>
      `
    });
    
    console.log(`${colors.green}✅ Test email sent successfully!${colors.reset}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`   Preview URL: ${previewUrl}`);
    } else {
      console.log(`   Check inbox: ${testEmail}`);
    }
    
    console.log(`\n${colors.green}🎉 All tests passed! Your SMTP is configured correctly.${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}❌ Failed to send test email: ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

testSMTP().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
