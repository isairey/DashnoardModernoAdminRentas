require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing Gmail SMTP Connection...\n');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : 'NOT SET');
console.log('\n');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: true,
  logger: true
});

transporter.verify((error, success) => {
  if (error) {
    console.error('\n❌ SMTP Connection Failed:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Make sure you are using a Gmail App Password (not your regular password)');
    console.error('2. Enable 2-Step Verification in your Google Account');
    console.error('3. Generate an App Password at: https://myaccount.google.com/apppasswords');
    console.error('4. Check if your firewall is blocking port 587');
    console.error('5. Try using port 465 with secure: true');
  } else {
    console.log('\n✅ SMTP Connection Successful!');
    console.log('You can now send emails.');
  }
  process.exit(error ? 1 : 0);
});
