const Stripe = require('stripe');

let stripe = null;

if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('✅ Stripe initialized successfully');
} else {
  console.warn('⚠️ Stripe not configured - payment features disabled. Set STRIPE_SECRET_KEY in .env');
}

module.exports = stripe;
