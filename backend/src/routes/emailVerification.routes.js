const express = require('express');
const router = express.Router();
const {
  sendVerificationCode,
  verifyEmail,
  resendVerificationCode,
  checkVerificationStatus,
  cleanupExpiredCodes
} = require('../controllers/emailVerification.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.post('/send', sendVerificationCode);
router.post('/verify', verifyEmail);
router.post('/resend', resendVerificationCode);
router.get('/status/:email', checkVerificationStatus);

// Admin routes
router.delete('/cleanup', protect, authorize('admin', 'superadmin'), cleanupExpiredCodes);

module.exports = router;
