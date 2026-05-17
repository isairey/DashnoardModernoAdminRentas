import axios from 'axios';

const API_URL = '/api/products';

// Get all products
const getProducts = async (params) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Get single product
const getProduct = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}`);
  return response.data.data;
};

// Get categories
const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data.data;
};

// Check availability
const checkAvailability = async (productId, data) => {
  const response = await axios.post(`${API_URL}/${productId}/check-availability`, data);
  return response.data.data;
};

// Create product (Vendor)
const createProduct = async (productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, productData, config);
  return response.data.data;
};

// Update product (Vendor)
const updateProduct = async (productId, productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${productId}`, productData, config);
  return response.data.data;
};

// Delete product (Vendor)
const deleteProduct = async (productId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${productId}`, config);
  return response.data;
};

// Get vendor products (Vendor)
const getVendorProducts = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  const response = await axios.get(`${API_URL}/vendor/my-products`, config);
  return response.data;
};

const productService = {
  getProducts,
  getProduct,
  getCategories,
  checkAvailability,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
};

export default productService;
