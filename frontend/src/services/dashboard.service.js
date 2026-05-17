import axios from 'axios';

const API_URL = '/api';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Get vendor dashboard data
export const getVendorDashboard = async () => {
  const response = await axios.get(`${API_URL}/dashboard/vendor`, getAuthConfig());
  return response.data;
};

// Get admin dashboard data
export const getAdminDashboard = async () => {
  const response = await axios.get(`${API_URL}/dashboard/admin`, getAuthConfig());
  return response.data;
};

// Get customer dashboard data
export const getCustomerDashboard = async () => {
  const response = await axios.get(`${API_URL}/dashboard/customer`, getAuthConfig());
  return response.data;
};
