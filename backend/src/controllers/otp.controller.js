const jwt = require('jsonwebtoken');
const OTP = require('../models/OTP');
const User = require('../models/User');
const emailService = require('../services/email.service');

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map();

// Helper: Check rate limit
const checkRateLimit = (email, maxAttempts = 3, windowMs = 15 * 60 * 1000) => {
  const key = `otp:${email}`;
  const now = Date.now();
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  const record = rateLimitStore.get(key);
  
  if (now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  if (record.count >= maxAttempts) {
    const resetIn = Math.ceil((record.resetAt - now) / 1000 / 60);
    return { allowed: false, remaining: 0, resetIn };
  }
  
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

// Helper: Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Request OTP (for both signup and login)
// @route   POST /api/auth/request-otp
// @access  Public
exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
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

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    const purpose = existingUser ? 'login' : 'signup';

    // Invalidate any existing unused OTPs for this email
    await OTP.updateMany(
      { email: email.toLowerCase(), isUsed: false },
      { isUsed: true }
    );

    // Generate new OTP
    const otp = OTP.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create OTP record
    const otpRecord = new OTP({
      email: email.toLowerCase(),
      expiresAt,
      purpose,
      ...getClientInfo(req)
    });

    // Hash and store OTP
    otpRecord.otpHash = otpRecord.hashOTP(otp);
    await otpRecord.save();

    // Send OTP email (NO console logging)
    try {
      await emailService.sendOTPEmail(email, otp, purpose);
    } catch (emailError) {
      // If email fails, delete the OTP record
      await OTP.findByIdAndDelete(otpRecord._id);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}. Please check your inbox.`,
      data: {
        email: email.toLowerCase(),
        expiresIn: 300, // seconds
        remaining: rateLimit.remaining,
        purpose
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

// @desc    Verify OTP and login/signup
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format'
      });
    }

    // Find the most recent unused OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      isUsed: false
    })
      .select('+otpHash')
      .sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No valid OTP found. Please request a new one.'
      });
    }

    // Check if expired
    if (otpRecord.isExpired()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
        expired: true
      });
    }

    // Check if locked
    if (otpRecord.isLocked()) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.',
        locked: true
      });
    }

    // Verify OTP
    const isValid = otpRecord.verifyOTP(otp);
    
    if (!isValid) {
      await otpRecord.incrementAttempts();
      const remainingAttempts = otpRecord.maxAttempts - otpRecord.attempts;
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        remainingAttempts
      });
    }

    // OTP is valid - mark as used
    await otpRecord.markAsUsed();

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    let isNewUser = false;

    if (!user) {
      // Create new user (signup)
      user = await User.create({
        email: email.toLowerCase(),
        name: email.split('@')[0], // Default name from email
        role: 'customer',
        isEmailVerified: true, // Auto-verified via OTP
        emailVerifiedAt: new Date()
      });
      isNewUser = true;

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user.email, user.name);
      } catch (emailError) {
        // Don't fail if welcome email fails
      }
    } else {
      // Update last login for existing user
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    // Store user data in response format
    const userData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token
    };

    // Store in localStorage format
    res.status(200).json({
      success: true,
      message: isNewUser ? 'Account created successfully!' : 'Login successful!',
      data: userData,
      isNewUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check rate limit (stricter for resend)
    const rateLimit = checkRateLimit(email, 3, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: `Too many resend requests. Please try again in ${rateLimit.resetIn} minutes.`,
        retryAfter: rateLimit.resetIn * 60
      });
    }

    // Check if user exists to determine purpose
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    const purpose = existingUser ? 'login' : 'signup';

    // Invalidate existing OTPs
    await OTP.updateMany(
      { email: email.toLowerCase(), isUsed: false },
      { isUsed: true }
    );

    // Generate new OTP
    const otp = OTP.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otpRecord = new OTP({
      email: email.toLowerCase(),
      expiresAt,
      purpose,
      ...getClientInfo(req)
    });

    otpRecord.otpHash = otpRecord.hashOTP(otp);
    await otpRecord.save();

    // Send email
    try {
      await emailService.sendOTPEmail(email, otp, purpose);
    } catch (emailError) {
      await OTP.findByIdAndDelete(otpRecord._id);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: `New OTP sent to ${email}`,
      data: {
        email: email.toLowerCase(),
        expiresIn: 300,
        remaining: rateLimit.remaining,
        purpose
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};

module.exports = exports;
