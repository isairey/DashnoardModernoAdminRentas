const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  settings: {
    currency: {
      type: String,
      default: 'INR'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    taxRate: {
      type: Number,
      default: 0.18 // 18% GST
    },
    dateFormat: {
      type: String,
      default: 'DD/MM/YYYY'
    }
  },
  contact: {
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' }
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'trial', 'expired', 'cancelled'],
      default: 'trial'
    },
    trialEndsAt: Date,
    expiresAt: Date,
    maxVendors: {
      type: Number,
      default: 5
    },
    maxProducts: {
      type: Number,
      default: 100
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isTestCompany: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug from name before saving
companySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for faster lookups (slug already has unique: true which creates index)
companySchema.index({ owner: 1 });
companySchema.index({ isActive: 1 });

module.exports = mongoose.model('Company', companySchema);
