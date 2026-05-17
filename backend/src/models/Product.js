const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['electronics', 'furniture', 'vehicles', 'tools', 'sports', 'party', 'clothing', 'cameras', 'audio', 'outdoor', 'transport', 'other'],
    lowercase: true
  },
  images: [{
    type: String
  }],
  // Multi-tenant: Company this product belongs to (optional for backward compatibility)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pricing: {
    hourly: {
      type: Number,
      default: 0
    },
    daily: {
      type: Number,
      required: [true, 'Daily price is required']
    },
    weekly: {
      type: Number,
      default: 0
    },
    monthly: {
      type: Number,
      default: 0
    },
    securityDeposit: {
      type: Number,
      default: 0
    }
  },
  inventory: {
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: 1
    },
    availableQuantity: {
      type: Number,
      required: true
    }
  },
  specifications: {
    type: Map,
    of: String
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    default: 'good'
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
