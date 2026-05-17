const mongoose = require('mongoose');
const crypto = require('crypto');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otpHash: {
    type: String,
    required: true,
    select: false
  },
  expiresAt: {
    type: Date,
    required: true
    // Removed inline index - using compound index below
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  purpose: {
    type: String,
    enum: ['login', 'signup'],
    default: 'login'
  }
}, {
  timestamps: true
});

// TTL index - auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate 6-digit OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP using SHA-256
otpSchema.methods.hashOTP = function(otp) {
  return crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
};

// Verify OTP
otpSchema.methods.verifyOTP = function(candidateOTP) {
  const hashedCandidate = this.hashOTP(candidateOTP);
  return hashedCandidate === this.otpHash;
};

// Check if OTP is expired
otpSchema.methods.isExpired = function() {
  return Date.now() > this.expiresAt;
};

// Check if max attempts reached
otpSchema.methods.isLocked = function() {
  return this.attempts >= this.maxAttempts;
};

// Increment attempt counter
otpSchema.methods.incrementAttempts = async function() {
  this.attempts += 1;
  await this.save();
};

// Mark as used
otpSchema.methods.markAsUsed = async function() {
  this.isUsed = true;
  this.usedAt = new Date();
  await this.save();
};

module.exports = mongoose.model('OTP', otpSchema);
