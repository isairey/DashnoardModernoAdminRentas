const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getInvoice,
  getMyInvoices,
  getVendorInvoices,
  updateInvoiceStatus,
  processPayment,
  createPaymentIntent,
  getAllInvoices
} = require('../controllers/invoice.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Customer routes
router.get('/my-invoices', protect, authorize('customer'), getMyInvoices);
router.post('/:id/pay', protect, authorize('customer'), processPayment);
router.post('/:id/create-payment-intent', protect, authorize('customer'), createPaymentIntent);

// Vendor routes
router.post('/', protect, authorize('vendor', 'admin'), createInvoice);
router.get('/vendor-invoices', protect, authorize('vendor'), getVendorInvoices);
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateInvoiceStatus);

// Admin routes
router.get('/', protect, authorize('admin'), getAllInvoices);

// Shared routes
router.get('/:id', protect, getInvoice);

module.exports = router;
