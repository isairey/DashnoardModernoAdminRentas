const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Customer routes
router.post('/', protect, authorize('customer'), createOrder);
router.get('/my-orders', protect, authorize('customer'), getMyOrders);
router.put('/:id/cancel', protect, authorize('customer'), cancelOrder);

// Vendor routes
router.get('/vendor-orders', protect, authorize('vendor'), getVendorOrders);
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateOrderStatus);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);

// Stats route (vendor and admin)
router.get('/stats', protect, authorize('vendor', 'admin'), getOrderStats);

// Shared routes
router.get('/:id', protect, getOrder);

module.exports = router;
