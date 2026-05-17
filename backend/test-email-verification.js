// Test Email Verification System
// Run this script to test the email verification flow

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'Test123!',
  role: 'customer'
};

let verificationCode = '';

async function testRegistration() {
  console.log('\n📝 Step 1: Testing Registration...');
  console.log('User data:', testUser);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Registration failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function testVerification(code) {
  console.log('\n🔐 Step 2: Testing Email Verification...');
  console.log('Email:', testUser.email);
  console.log('Code:', code);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/email-verification/verify`, {
      email: testUser.email,
      code: code
    });
    console.log('✅ Verification successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Verification failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function testLogin() {
  console.log('\n🔑 Step 3: Testing Login...');
  console.log('Email:', testUser.email);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Email Verification Tests...');
  console.log('Base URL:', BASE_URL);
  console.log('='.repeat(60));
  
  // Step 1: Register
  const registrationSuccess = await testRegistration();
  if (!registrationSuccess) {
    console.log('\n❌ Tests failed at registration step');
    return;
  }
  
  // Prompt for verification code
  console.log('\n⏸️  PAUSED: Check your server console for the verification code');
  console.log('📋 Look for a log like: 🔑 Verification code: 123456');
  console.log('\nTo continue testing:');
  console.log('1. Copy the 6-digit code from server console');
  console.log('2. Run: node test-email-verification.js verify <code>');
  console.log(`   Example: node test-email-verification.js verify 123456`);
  console.log(`\nOr test manually with curl:`);
  console.log(`curl -X POST ${BASE_URL}/api/email-verification/verify \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"email":"${testUser.email}","code":"YOUR_CODE_HERE"}'`);
}

async function runVerificationTest(code) {
  console.log('🚀 Testing Email Verification with provided code...');
  console.log('='.repeat(60));
  
  // Use the email from command line or default
  const email = process.argv[4] || testUser.email;
  
  const verificationSuccess = await testVerification(code);
  if (!verificationSuccess) {
    console.log('\n❌ Verification failed');
    return;
  }
  
  // Step 3: Login
  await testLogin();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 All tests completed!');
}

// Main execution
const command = process.argv[2];
const code = process.argv[3];

if (command === 'verify' && code) {
  runVerificationTest(code);
} else if (command === 'verify') {
  console.error('❌ Error: Please provide verification code');
  console.log('Usage: node test-email-verification.js verify <code>');
  console.log('Example: node test-email-verification.js verify 123456');
} else {
  runTests();
}
