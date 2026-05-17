const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  // Multi-tenant: Company this reservation belongs to (optional for backward compatibility)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['reserved', 'active', 'completed', 'cancelled'],
    default: 'reserved'
  }
}, {
  timestamps: true
});

// Index for efficient availability queries
reservationSchema.index({ company: 1, product: 1, startDate: 1, endDate: 1 });
reservationSchema.index({ status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
