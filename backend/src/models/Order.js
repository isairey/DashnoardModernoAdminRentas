const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  // Batch ID to link orders from same multi-vendor checkout
  batchId: {
    type: String,
    index: true
  },
  // Multi-tenant: Company this order belongs to (optional for backward compatibility)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerDay: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  rentalPeriod: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    durationType: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months'],
      default: 'days'
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    securityDeposit: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'picked-up', 'active', 'returned', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  notes: {
    customer: String,
    vendor: String,
    internal: String
  },
  timeline: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
