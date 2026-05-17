const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  // Invoice type: 'vendor' for individual vendor invoices, 'customer' for combined customer invoice
  invoiceType: {
    type: String,
    enum: ['vendor', 'customer'],
    default: 'vendor'
  },
  // Batch ID to link all invoices from same multi-vendor checkout
  batchId: {
    type: String,
    index: true
  },
  // Multi-tenant: Company this invoice belongs to (optional for backward compatibility)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
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
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  amounts: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    securityDeposit: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    amountDue: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'],
    default: 'draft'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  payments: [{
    amount: Number,
    method: {
      type: String,
      enum: ['card', 'bank', 'cash', 'other']
    },
    transactionId: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String
}, {
  timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
