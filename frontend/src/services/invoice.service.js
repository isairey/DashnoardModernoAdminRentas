import axios from 'axios';

const API_URL = '/api/invoices';

// Create invoice (Vendor)
const createInvoice = async (invoiceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, invoiceData, config);
  return response.data.data;
};

// Get invoice
const getInvoice = async (invoiceId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${invoiceId}`, config);
  return response.data.data;
};

// Get customer invoices
const getMyInvoices = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  const response = await axios.get(`${API_URL}/my-invoices`, config);
  return response.data;
};

// Get vendor invoices
const getVendorInvoices = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  const response = await axios.get(`${API_URL}/vendor-invoices`, config);
  return response.data;
};

// Update invoice status (Vendor)
const updateInvoiceStatus = async (invoiceId, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${invoiceId}/status`, { status }, config);
  return response.data.data;
};

// Create payment intent (Customer)
const createPaymentIntent = async (invoiceId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/${invoiceId}/create-payment-intent`, {}, config);
  return response.data.data;
};

// Process payment (Customer)
const processPayment = async (invoiceId, paymentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/${invoiceId}/pay`, paymentData, config);
  return response.data;
};

// Get all invoices (Admin)
const getAllInvoices = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const invoiceService = {
  createInvoice,
  getInvoice,
  getMyInvoices,
  getVendorInvoices,
  updateInvoiceStatus,
  createPaymentIntent,
  processPayment,
  getAllInvoices,
};

export default invoiceService;
