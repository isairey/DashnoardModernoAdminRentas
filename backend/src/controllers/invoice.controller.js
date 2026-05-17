const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const stripe = require('../config/payment');

// @desc    Create invoice for order
// @route   POST /api/invoices
// @access  Private/Vendor
exports.createInvoice = async (req, res) => {
  try {
    const { orderId, dueDate, notes } = req.body;

    const order = await Order.findById(orderId)
      .populate('customer', 'name email')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create invoice for this order'
      });
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({ order: orderId });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already exists for this order'
      });
    }

    // Build invoice items
    const invoiceItems = order.items.map(item => ({
      description: item.product.name,
      quantity: item.quantity,
      unitPrice: item.pricePerDay,
      totalPrice: item.totalPrice
    }));

    // Add security deposit as line item
    if (order.pricing.securityDeposit > 0) {
      invoiceItems.push({
        description: 'Security Deposit',
        quantity: 1,
        unitPrice: order.pricing.securityDeposit,
        totalPrice: order.pricing.securityDeposit
      });
    }

    const invoice = await Invoice.create({
      order: orderId,
      customer: order.customer._id,
      vendor: order.vendor,
      items: invoiceItems,
      amounts: {
        subtotal: order.pricing.subtotal,
        tax: order.pricing.tax,
        discount: order.pricing.discount,
        securityDeposit: order.pricing.securityDeposit,
        total: order.pricing.total,
        amountDue: order.pricing.total
      },
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      notes
    });

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('order')
      .populate('customer', 'name email phone address')
      .populate('vendor', 'name vendorInfo.businessName phone');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Check authorization
    const isCustomer = invoice.customer._id.toString() === req.user.id;
    const isVendor = invoice.vendor._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isVendor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this invoice'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get customer invoices (only combined customer invoices)
// @route   GET /api/invoices/my-invoices
// @access  Private/Customer
exports.getMyInvoices = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Show only customer-type invoices (combined invoices)
    const query = { 
      customer: req.user.id,
      $or: [
        { invoiceType: 'customer' },
        { invoiceType: { $exists: false } } // Backward compatibility for old invoices
      ]
    };
    if (status) query.status = status;

    const invoices = await Invoice.find(query)
      .populate('vendor', 'name vendorInfo.businessName')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vendor invoices (only vendor-specific invoices)
// @route   GET /api/invoices/vendor-invoices
// @access  Private/Vendor
exports.getVendorInvoices = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Show only vendor-type invoices (individual vendor invoices)
    const query = { 
      vendor: req.user.id,
      $or: [
        { invoiceType: 'vendor' },
        { invoiceType: { $exists: false } } // Backward compatibility for old invoices
      ]
    };
    if (status) query.status = status;

    const invoices = await Invoice.find(query)
      .populate('customer', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update invoice status
// @route   PUT /api/invoices/:id/status
// @access  Private/Vendor
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    if (invoice.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this invoice'
      });
    }

    invoice.status = status;
    if (status === 'sent' && invoice.status === 'draft') {
      // Mark as sent
    }
    await invoice.save();

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process payment
// @route   POST /api/invoices/:id/pay
// @access  Private/Customer
exports.processPayment = async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact support.'
      });
    }

    const { paymentMethodId, amount } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    if (invoice.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay this invoice'
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Record payment
      invoice.payments.push({
        amount,
        method: 'card',
        transactionId: paymentIntent.id,
        date: new Date()
      });

      invoice.amounts.amountPaid += amount;
      invoice.amounts.amountDue -= amount;

      if (invoice.amounts.amountDue <= 0) {
        invoice.status = 'paid';
        invoice.paidDate = new Date();

        // Update order payment status
        await Order.findByIdAndUpdate(invoice.order, {
          paymentStatus: 'paid'
        });
      } else {
        invoice.status = 'partial';
        await Order.findByIdAndUpdate(invoice.order, {
          paymentStatus: 'partial'
        });
      }

      await invoice.save();

      res.json({
        success: true,
        data: invoice,
        message: 'Payment processed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create payment intent
// @route   POST /api/invoices/:id/create-payment-intent
// @access  Private/Customer
exports.createPaymentIntent = async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact support.'
      });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(invoice.amounts.amountDue * 100),
      currency: 'usd',
      metadata: {
        invoiceId: invoice._id.toString()
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all invoices (Admin)
// @route   GET /api/invoices
// @access  Private/Admin
exports.getAllInvoices = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const invoices = await Invoice.find(query)
      .populate('customer', 'name email')
      .populate('vendor', 'name vendorInfo.businessName')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
