const express = require('express');
const router = express.Router();
const {
  register,
  login,
  selectCompany,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserStatus,
  approveVendor
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/select-company', protect, selectCompany);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/status', protect, authorize('admin'), updateUserStatus);
router.put('/vendors/:id/approve', protect, authorize('admin'), approveVendor);

module.exports = router;
