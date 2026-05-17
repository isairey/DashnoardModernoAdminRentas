const mongoose = require('mongoose');
const crypto = require('crypto');

const emailVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  codeHash: {
    type: String,
    required: true,
    select: false
  },
  expiresAt: {
    type: Date,
    required: true
    // Removed inline index - using TTL index below
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
  verifiedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired codes
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate a 6-digit verification code
emailVerificationSchema.statics.generateCode = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash the verification code
emailVerificationSchema.methods.hashCode = function(code) {
  return crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');
};

// Verify the code
emailVerificationSchema.methods.verifyCode = function(candidateCode) {
  const hashedCandidate = this.hashCode(candidateCode);
  return hashedCandidate === this.codeHash;
};

// Check if code is expired
emailVerificationSchema.methods.isExpired = function() {
  return Date.now() > this.expiresAt;
};

// Check if max attempts reached
emailVerificationSchema.methods.isLocked = function() {
  return this.attempts >= this.maxAttempts;
};

// Increment attempt counter
emailVerificationSchema.methods.incrementAttempts = async function() {
  this.attempts += 1;
  await this.save();
};

// Mark as used
emailVerificationSchema.methods.markAsUsed = async function() {
  this.isUsed = true;
  this.verifiedAt = new Date();
  await this.save();
};

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);
