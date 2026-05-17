import axios from 'axios';

const API_URL = '/api/auth';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  // DON'T save token if email verification is required
  if (response.data.data.token && !response.data.data.requiresEmailVerification) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.data.token);
  }
  
  return response.data.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  
  // Only save token if user is verified
  if (response.data.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.data.token);
  }
  
  return response.data.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Get current user
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/me`, config);
  return response.data.data;
};

// Update profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/profile`, userData, config);
  return response.data.data;
};

// Change password
const changePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/password`, passwordData, config);
  return response.data;
};

// Get all users (Admin)
const getAllUsers = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  const response = await axios.get(`${API_URL}/users`, config);
  return response.data;
};

// Update user status (Admin)
const updateUserStatus = async (userId, isActive, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/users/${userId}/status`, { isActive }, config);
  return response.data.data;
};

// Approve vendor (Admin)
const approveVendor = async (vendorId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/vendors/${vendorId}/approve`, {}, config);
  return response.data.data;
};

// Select company (for multi-company users)
const selectCompany = async (companyId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/select-company`, { companyId }, config);
  if (response.data.data.token) {
    // Update localStorage with new token that includes company context
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...existingUser,
      user: response.data.data.user,
      token: response.data.data.token
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserStatus,
  approveVendor,
  selectCompany,
};

export default authService;
