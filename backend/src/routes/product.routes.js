const express = require('express');


const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  checkAvailability,
  getCategories
} = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/:id/check-availability', checkAvailability);

// Vendor routes
router.post('/', protect, authorize('vendor', 'admin'), createProduct);
router.get('/vendor/my-products', protect, authorize('vendor'), getVendorProducts);
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

module.exports = router;
