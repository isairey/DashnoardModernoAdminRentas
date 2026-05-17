const EmailVerification = require('../models/EmailVerification');
const User = require('../models/User');
const emailService = require('../services/email.service');

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

// Helper: Check rate limit
const checkRateLimit = (email, maxAttempts = 3, windowMs = 15 * 60 * 1000) => {
  const key = `resend:${email}`;
  const now = Date.now();
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  const record = rateLimitStore.get(key);
  
  // Reset if window expired
  if (now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  // Check if limit exceeded
  if (record.count >= maxAttempts) {
    const resetIn = Math.ceil((record.resetAt - now) / 1000 / 60);
    return { 
      allowed: false, 
      remaining: 0,
      resetIn 
    };
  }
  
  // Increment count
  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count };
};

// Helper: Get client info
const getClientInfo = (req) => {
  return {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  };
};

// @desc    Send verification code
// @route   POST /api/email-verification/send
// @access  Public (but requires valid user)
exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check rate limit
    const rateLimit = checkRateLimit(email);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again in ${rateLimit.resetIn} minutes.`,
        retryAfter: rateLimit.resetIn * 60
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not (security)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a verification code has been sent.'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Invalidate any existing unused codes for this user
    await EmailVerification.updateMany(
      { user: user._id, isUsed: false },
      { isUsed: true }
    );

    // Generate new verification code
    const code = EmailVerification.generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create verification record
    const verification = new EmailVerification({
      user: user._id,
      email: user.email,
      code: code, // Store plain code temporarily for hashing
      expiresAt,
      ...getClientInfo(req)
    });

    // Hash the code before saving
    verification.codeHash = verification.hashCode(code);
    verification.code = undefined; // Remove plain code
    await verification.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user.email, code, user.name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
      // In production, you might want to queue this for retry
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      data: {
        email: user.email,
        expiresIn: 600, // seconds
        remaining: rateLimit.remaining
      }
    });
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code'
    });
  }
};

// @desc    Verify email with code
// @route   POST /api/email-verification/verify
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    console.log('🔍 Verification attempt:', { email, code });

    // Validate input
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      console.log('❌ Invalid code format:', code);
      return res.status(400).json({
        success: false,
        message: 'Invalid code format'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      console.log('⚠️  Email already verified:', email);
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Find the most recent unused verification code
    const verification = await EmailVerification.findOne({
      user: user._id,
      isUsed: false
    })
      .select('+codeHash')
      .sort({ createdAt: -1 });

    if (!verification) {
      console.log('❌ No verification code found for user:', email);
      return res.status(404).json({
        success: false,
        message: 'No verification code found. Please request a new one.'
      });
    }

    console.log('📋 Verification record found:', {
      attempts: verification.attempts,
      maxAttempts: verification.maxAttempts,
      expiresAt: verification.expiresAt,
      isExpired: verification.isExpired()
    });

    // Check if expired
    if (verification.isExpired()) {
      console.log('⏰ Code expired:', verification.expiresAt);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
        expired: true
      });
    }

    // Check if locked due to too many attempts
    if (verification.isLocked()) {
      console.log('🔒 Too many attempts:', verification.attempts);
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new code.',
        locked: true
      });
    }

    // Verify the code
    const isValid = verification.verifyCode(code);
    
    console.log('🔐 Code verification result:', isValid);
    
    if (!isValid) {
      // Increment failed attempts
      await verification.incrementAttempts();
      
      const remainingAttempts = verification.maxAttempts - verification.attempts;
      
      console.log('❌ Invalid code. Remaining attempts:', remainingAttempts);
      
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
        remainingAttempts
      });
    }

    // Code is valid - verify the user
    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    // Mark verification as used
    await verification.markAsUsed();

    console.log('✅ Email verified successfully:', email);

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
      console.log('📧 Welcome email sent');
    } catch (emailError) {
      console.error('⚠️  Welcome email failed:', emailError.message);
      // Don't fail the request
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          emailVerifiedAt: user.emailVerifiedAt
        }
      }
    });
  } catch (error) {
    console.error('❌ Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message
    });
  }
};

// @desc    Resend verification code
// @route   POST /api/email-verification/resend
// @access  Public
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check rate limit (stricter for resend)
    const rateLimit = checkRateLimit(email, 3, 15 * 60 * 1000); // 3 attempts per 15 minutes
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: `Too many resend requests. Please try again in ${rateLimit.resetIn} minutes.`,
        retryAfter: rateLimit.resetIn * 60
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a new verification code has been sent.'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Invalidate existing codes
    await EmailVerification.updateMany(
      { user: user._id, isUsed: false },
      { isUsed: true }
    );

    // Generate new code
    const code = EmailVerification.generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const verification = new EmailVerification({
      user: user._id,
      email: user.email,
      code: code,
      expiresAt,
      ...getClientInfo(req)
    });

    verification.codeHash = verification.hashCode(code);
    verification.code = undefined;
    await verification.save();

    // Send email
    try {
      await emailService.sendVerificationEmail(user.email, code, user.name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email',
      data: {
        email: user.email,
        expiresIn: 600,
        remaining: rateLimit.remaining
      }
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code'
    });
  }
};

// @desc    Check verification status
// @route   GET /api/email-verification/status/:email
// @access  Public
exports.checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt
      }
    });
  } catch (error) {
    console.error('Check status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check verification status'
    });
  }
};

// @desc    Clean up expired verification codes (Admin/Cron)
// @route   DELETE /api/email-verification/cleanup
// @access  Private/Admin
exports.cleanupExpiredCodes = async (req, res) => {
  try {
    const result = await EmailVerification.deleteMany({
      expiresAt: { $lt: new Date() }
    });

    res.status(200).json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired verification codes`
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup expired codes'
    });
  }
};

module.exports = exports;
