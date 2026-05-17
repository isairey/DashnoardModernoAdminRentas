const express = require('express');
const router = express.Router();
const {
  getVendorDashboard,
  getAdminDashboard,
  getCustomerDashboard
} = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Vendor dashboard
router.get('/vendor', protect, authorize('vendor', 'admin'), getVendorDashboard);

// Admin dashboard
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

// Customer dashboard
router.get('/customer', protect, getCustomerDashboard);

module.exports = router;
