import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Get Stripe instance
const getStripe = async () => {
  return await stripePromise;
};

// Create checkout session
const createCheckoutSession = async (invoiceId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`/api/invoices/${invoiceId}/create-payment-intent`, {}, config);
  return response.data.data;
};

// Process card payment
const processCardPayment = async (stripe, elements, clientSecret) => {
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement('card'),
    },
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.paymentIntent;
};

const paymentService = {
  getStripe,
  createCheckoutSession,
  processCardPayment,
};

export default paymentService;
