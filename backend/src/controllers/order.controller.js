const Order = require('../models/Order');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const reservationService = require('../services/reservation.service');
const pricingService = require('../services/pricing.service');

// @desc    Create order (supports multi-vendor checkout)
// @route   POST /api/orders
// @access  Private/Customer
exports.createOrder = async (req, res) => {
  try {
    const { items, rentalPeriod, deliveryMethod, deliveryAddress, notes } = req.body;

    // Calculate rental duration
    const duration = Math.ceil(
      (new Date(rentalPeriod.endDate) - new Date(rentalPeriod.startDate)) / (1000 * 60 * 60 * 24)
    ) || 1;

    // Group items by vendor
    const vendorItemsMap = new Map();

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      const vendorKey = product.vendor.toString();
      
      if (!vendorItemsMap.has(vendorKey)) {
        vendorItemsMap.set(vendorKey, {
          vendorId: product.vendor,
          companyId: product.company,
          items: [],
          subtotal: 0,
          totalDeposit: 0
        });
      }

      // Calculate pricing for this item
      const itemPrice = pricingService.calculateRentalPrice(product.pricing, duration, item.quantity);

      vendorItemsMap.get(vendorKey).items.push({
        product: item.productId,
        productName: product.name,
        quantity: item.quantity,
        pricePerDay: product.pricing.daily,
        totalPrice: itemPrice,
        deposit: (product.pricing.securityDeposit || 0) * item.quantity
      });

      vendorItemsMap.get(vendorKey).subtotal += itemPrice;
      vendorItemsMap.get(vendorKey).totalDeposit += (product.pricing.securityDeposit || 0) * item.quantity;
    }

    // Create orders and invoices for each vendor
    const createdOrders = [];
    const vendorInvoices = [];
    let customerInvoiceItems = [];
    let customerSubtotal = 0;
    let customerTotalDeposit = 0;
    let customerTax = 0;
    let customerTotal = 0;
    let firstOrderId = null;

    // Generate a batch ID to link all orders from this checkout
    const batchId = `BATCH-${Date.now()}`;

    for (const [vendorKey, vendorData] of vendorItemsMap) {
      const { vendorId, companyId, items: vendorItems, subtotal, totalDeposit } = vendorData;

      // Calculate tax (10%)
      const tax = subtotal * 0.1;
      const total = subtotal + tax + totalDeposit;

      // Generate order number
      const orderCount = await Order.countDocuments();
      const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

      // Create order for this vendor
      const order = await Order.create({
        orderNumber,
        batchId, // Link orders from same checkout
        customer: req.user.id,
        vendor: vendorId,
        company: companyId,
        items: vendorItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          pricePerDay: item.pricePerDay,
          totalPrice: item.totalPrice
        })),
        rentalPeriod: {
          startDate: rentalPeriod.startDate,
          endDate: rentalPeriod.endDate,
          duration,
          durationType: 'days'
        },
        pricing: {
          subtotal,
          securityDeposit: totalDeposit,
          tax,
          total
        },
        status: 'confirmed',
        paymentStatus: 'paid',
        deliveryMethod,
        deliveryAddress,
        notes: { customer: notes },
        timeline: [
          { status: 'confirmed', note: 'Order placed successfully' },
          { status: 'paid', note: 'Payment completed' }
        ]
      });

      if (!firstOrderId) firstOrderId = order._id;

      // Create vendor-specific invoice
      const vendorInvoiceCount = await Invoice.countDocuments();
      const vendorInvoiceNumber = `INV-V-${Date.now()}-${vendorInvoiceCount + 1}`;

      const vendorInvoiceItems = vendorItems.map(item => ({
        description: `${item.productName} (${item.quantity} x ${duration} days)`,
        quantity: item.quantity,
        unitPrice: item.pricePerDay,
        totalPrice: item.totalPrice
      }));

      if (totalDeposit > 0) {
        vendorInvoiceItems.push({
          description: 'Security Deposit (Refundable)',
          quantity: 1,
          unitPrice: totalDeposit,
          totalPrice: totalDeposit
        });
      }

      const vendorInvoice = await Invoice.create({
        invoiceNumber: vendorInvoiceNumber,
        invoiceType: 'vendor', // Mark as vendor invoice
        order: order._id,
        customer: req.user.id,
        vendor: vendorId,
        company: companyId,
        items: vendorInvoiceItems,
        amounts: {
          subtotal,
          tax,
          discount: 0,
          securityDeposit: totalDeposit,
          total,
          amountPaid: total,
          amountDue: 0
        },
        status: 'paid',
        dueDate: new Date(),
        paidDate: new Date(),
        payments: [{
          amount: total,
          method: 'card',
          date: new Date(),
          transactionId: `PAY-V-${Date.now()}-${vendorKey.substring(0, 8)}`
        }]
      });

      vendorInvoices.push(vendorInvoice);

      // Accumulate for customer invoice
      customerInvoiceItems = customerInvoiceItems.concat(vendorInvoiceItems);
      customerSubtotal += subtotal;
      customerTotalDeposit += totalDeposit;
      customerTax += tax;
      customerTotal += total;

      // Populate and add to created orders
      const populatedOrder = await Order.findById(order._id)
        .populate('customer', 'name email phone')
        .populate('vendor', 'name vendorInfo.businessName')
        .populate('items.product', 'name images');

      createdOrders.push(populatedOrder);
    }

    // Create a single combined customer invoice
    const customerInvoiceCount = await Invoice.countDocuments();
    const customerInvoiceNumber = `INV-C-${Date.now()}-${customerInvoiceCount + 1}`;

    // Get the first vendor for the customer invoice (we'll use the first order's vendor)
    const firstVendorData = vendorItemsMap.values().next().value;

    const customerInvoice = await Invoice.create({
      invoiceNumber: customerInvoiceNumber,
      invoiceType: 'customer', // Mark as customer invoice
      batchId, // Link to the batch
      order: firstOrderId, // Reference first order
      customer: req.user.id,
      vendor: firstVendorData.vendorId, // Required field, use first vendor
      company: firstVendorData.companyId,
      items: customerInvoiceItems,
      amounts: {
        subtotal: customerSubtotal,
        tax: customerTax,
        discount: 0,
        securityDeposit: customerTotalDeposit,
        total: customerTotal,
        amountPaid: customerTotal,
        amountDue: 0
      },
      status: 'paid',
      dueDate: new Date(),
      paidDate: new Date(),
      payments: [{
        amount: customerTotal,
        method: 'card',
        date: new Date(),
        transactionId: `PAY-C-${Date.now()}`
      }],
      notes: `Combined invoice for ${createdOrders.length} vendor order(s)`
    });

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdOrders.length} order(s) from ${vendorItemsMap.size} vendor(s)`,
      data: createdOrders.length === 1 ? createdOrders[0] : createdOrders,
      invoices: {
        customer: customerInvoice,
        vendors: vendorInvoices
      },
      summary: {
        totalOrders: createdOrders.length,
        totalVendors: vendorItemsMap.size,
        totalAmount: customerTotal,
        batchId
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get customer orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
exports.getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { customer: req.user.id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('vendor', 'name vendorInfo.businessName')
      .populate('items.product', 'name images')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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

// @desc    Get vendor orders
// @route   GET /api/orders/vendor-orders
// @access  Private/Vendor
exports.getVendorOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { vendor: req.user.id };
    
    // Scope by company if available
    if (req.companyId) {
      query.company = req.companyId;
    }
    
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images')
      .populate('company', 'name slug')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('vendor', 'name vendorInfo.businessName phone')
      .populate('items.product', 'name images pricing');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const isCustomer = order.customer._id.toString() === req.user.id;
    const isVendor = order.vendor._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isVendor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Vendor
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['confirmed', 'picked-up', 'active', 'returned', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(req.params.id);

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
        message: 'Not authorized to update this order'
      });
    }

    order.status = status;
    order.timeline.push({
      status,
      note: note || `Order status updated to ${status}`,
      date: new Date()
    });

    // Update reservation status based on order status
    if (status === 'picked-up' || status === 'active') {
      await reservationService.updateReservationStatus(order._id, 'active');
    } else if (status === 'returned' || status === 'completed') {
      await reservationService.updateReservationStatus(order._id, 'completed');
      // Release inventory
      for (const item of order.items) {
        await reservationService.releaseInventory(item.product, item.quantity);
      }
    } else if (status === 'cancelled') {
      await reservationService.updateReservationStatus(order._id, 'cancelled');
      // Release inventory
      for (const item of order.items) {
        await reservationService.releaseInventory(item.product, item.quantity);
      }
    }

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private/Customer
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if customer owns this order
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status'
      });
    }

    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      note: 'Order cancelled by customer',
      date: new Date()
    });

    // Cancel reservations and release inventory
    await reservationService.updateReservationStatus(order._id, 'cancelled');
    for (const item of order.items) {
      await reservationService.releaseInventory(item.product, item.quantity);
    }

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('vendor', 'name vendorInfo.businessName')
      .populate('items.product', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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

// @desc    Get order stats
// @route   GET /api/orders/stats
// @access  Private/Admin/Vendor
exports.getOrderStats = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'vendor') {
      query.vendor = req.user.id;
    }

    const stats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments(query);
    const totalRevenue = await Order.aggregate([
      { $match: { ...query, status: { $in: ['completed', 'active'] } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    res.json({
      success: true,
      data: {
        byStatus: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
