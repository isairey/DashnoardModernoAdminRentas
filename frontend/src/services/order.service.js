import axios from 'axios';

const API_URL = '/api/orders';

// Create order (Customer) - supports multi-vendor checkout
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, orderData, config);
  // Response now includes data (order/orders), invoices, and summary
  return response.data;
};

// Get customer orders
const getMyOrders = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  const response = await axios.get(`${API_URL}/my-orders`, config);
  return response.data;
};

// Get vendor orders
const getVendorOrders = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  const response = await axios.get(`${API_URL}/vendor-orders`, config);
  return response.data;
};

// Get single order
const getOrder = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${orderId}`, config);
  return response.data.data;
};

// Update order status (Vendor)
const updateOrderStatus = async (orderId, statusData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${orderId}/status`, statusData, config);
  return response.data.data;
};

// Cancel order (Customer)
const cancelOrder = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${orderId}/cancel`, {}, config);
  return response.data.data;
};

// Get all orders (Admin)
const getAllOrders = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get order stats
const getOrderStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/stats`, config);
  return response.data.data;
};

const orderService = {
  createOrder,
  getMyOrders,
  getVendorOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats,
};

export default orderService;
