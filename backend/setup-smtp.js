#!/usr/bin/env node

/**
 * Interactive SMTP Configuration Setup
 * Run: node setup-smtp.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function setupSMTP() {
  console.log(`\n${colors.bright}${colors.cyan}=== SMTP Configuration Setup ===${colors.reset}\n`);
  
  console.log('Choose your email provider:\n');
  console.log('1. Gmail (Recommended for testing)');
  console.log('2. Ethereal (Free test emails - no real delivery)');
  console.log('3. SendGrid (Production)');
  console.log('4. Custom SMTP\n');
  
  const choice = await question('Enter your choice (1-4): ');
  
  let config = {};
  
  switch (choice.trim()) {
    case '1':
      config = await setupGmail();
      break;
    case '2':
      config = await setupEthereal();
      break;
    case '3':
      config = await setupSendGrid();
      break;
    case '4':
      config = await setupCustom();
      break;
    default:
      console.log(`${colors.yellow}Invalid choice. Exiting.${colors.reset}`);
      rl.close();
      return;
  }
  
  // Write to .env file
  await writeEnvFile(config);
  
  console.log(`\n${colors.green}✅ SMTP configuration saved to .env file!${colors.reset}`);
  console.log(`\n${colors.bright}Next steps:${colors.reset}`);
  console.log('1. Restart your server: npm start');
  console.log('2. Test registration with a real email');
  console.log('3. Check your inbox for the OTP\n');
  
  rl.close();
}

async function setupGmail() {
  console.log(`\n${colors.bright}Gmail Setup${colors.reset}`);
  console.log('You need to generate an App Password:');
  console.log('1. Go to: https://myaccount.google.com/apppasswords');
  console.log('2. Enable 2-Factor Authentication if not enabled');
  console.log('3. Create app password for "Mail"');
  console.log('4. Copy the 16-character password\n');
  
  const email = await question('Enter your Gmail address: ');
  const password = await question('Enter your App Password: ');
  
  return {
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: email.trim(),
    SMTP_PASS: password.trim(),
    EMAIL_FROM: email.trim(),
    EMAIL_FROM_NAME: 'RentalHub'
  };
}

async function setupEthereal() {
  console.log(`\n${colors.bright}Ethereal Setup${colors.reset}`);
  console.log('Creating Ethereal test account...\n');
  
  const nodemailer = require('nodemailer');
  const testAccount = await nodemailer.createTestAccount();
  
  console.log(`${colors.green}✅ Ethereal account created!${colors.reset}`);
  console.log(`Email: ${testAccount.user}`);
  console.log(`Password: ${testAccount.pass}`);
  console.log(`\n${colors.yellow}Note: Emails won't be delivered. Check preview URLs in console.${colors.reset}\n`);
  
  return {
    SMTP_HOST: 'smtp.ethereal.email',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: testAccount.user,
    SMTP_PASS: testAccount.pass,
    EMAIL_FROM: 'noreply@rentalhub.com',
    EMAIL_FROM_NAME: 'RentalHub'
  };
}

async function setupSendGrid() {
  console.log(`\n${colors.bright}SendGrid Setup${colors.reset}`);
  console.log('You need a SendGrid API key:');
  console.log('1. Go to: https://sendgrid.com/');
  console.log('2. Create account and verify email');
  console.log('3. Go to Settings > API Keys');
  console.log('4. Create API Key with Full Access\n');
  
  const apiKey = await question('Enter your SendGrid API Key: ');
  const fromEmail = await question('Enter your verified sender email: ');
  
  return {
    SMTP_HOST: 'smtp.sendgrid.net',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: 'apikey',
    SMTP_PASS: apiKey.trim(),
    EMAIL_FROM: fromEmail.trim(),
    EMAIL_FROM_NAME: 'RentalHub'
  };
}

async function setupCustom() {
  console.log(`\n${colors.bright}Custom SMTP Setup${colors.reset}\n`);
  
  const host = await question('SMTP Host: ');
  const port = await question('SMTP Port (587): ') || '587';
  const secure = await question('Use SSL? (y/n): ');
  const user = await question('SMTP Username: ');
  const pass = await question('SMTP Password: ');
  const from = await question('From Email: ');
  
  return {
    SMTP_HOST: host.trim(),
    SMTP_PORT: port.trim(),
    SMTP_SECURE: secure.toLowerCase() === 'y' ? 'true' : 'false',
    SMTP_USER: user.trim(),
    SMTP_PASS: pass.trim(),
    EMAIL_FROM: from.trim(),
    EMAIL_FROM_NAME: 'RentalHub'
  };
}

async function writeEnvFile(config) {
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else {
    // Copy from .env.example
    const examplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(examplePath)) {
      envContent = fs.readFileSync(examplePath, 'utf8');
    }
  }
  
  // Update SMTP configuration
  Object.keys(config).forEach(key => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${config[key]}`);
    } else {
      envContent += `\n${key}=${config[key]}`;
    }
  });
  
  // Write back to .env
  fs.writeFileSync(envPath, envContent);
}

// Run setup
setupSMTP().catch(error => {
  console.error(`${colors.yellow}Error:${colors.reset}`, error.message);
  rl.close();
  process.exit(1);
});
