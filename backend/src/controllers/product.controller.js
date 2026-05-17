const Product = require('../models/Product');
const reservationService = require('../services/reservation.service');

// @desc    Create product
// @route   POST /api/products
// @access  Private/Vendor
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      vendor: req.user.id,
      inventory: {
        totalQuantity: req.body.totalQuantity,
        availableQuantity: req.body.totalQuantity
      }
    };

    // Add company context if available (optional for backward compatibility)
    if (req.companyId) {
      productData.company = req.companyId;
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      city,
      condition,
      companyId,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    const query = { isActive: true };

    // Company filter (optional for public listings, required for vendor/admin)
    if (companyId) {
      query.company = companyId;
    } else if (req.companyId) {
      query.company = req.companyId;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query['pricing.daily'] = {};
      if (minPrice) query['pricing.daily'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.daily'].$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    const products = await Product.find(query)
      .populate('vendor', 'name vendorInfo.businessName')
      .populate('company', 'name slug')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sort);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name vendorInfo.businessName phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Vendor
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vendor products
// @route   GET /api/products/vendor/my-products
// @access  Private/Vendor
exports.getVendorProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { vendor: req.user.id };
    
    // Scope by company if available
    if (req.companyId) {
      query.company = req.companyId;
    }
    
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const products = await Product.find(query)
      .populate('company', 'name slug')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
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

// @desc    Check product availability
// @route   POST /api/products/:id/check-availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { startDate, endDate, quantity = 1 } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const availability = await reservationService.checkAvailability(
      req.params.id,
      new Date(startDate),
      new Date(endDate),
      quantity
    );

    res.json({
      success: true,
      data: {
        isAvailable: availability.isAvailable,
        availableQuantity: availability.availableQuantity,
        requestedQuantity: quantity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'electronics', name: 'Electronics', icon: '💻' },
      { id: 'furniture', name: 'Furniture', icon: '🪑' },
      { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
      { id: 'tools', name: 'Tools', icon: '🔧' },
      { id: 'sports', name: 'Sports Equipment', icon: '⚽' },
      { id: 'party', name: 'Party Supplies', icon: '🎉' },
      { id: 'clothing', name: 'Clothing', icon: '👔' },
      { id: 'other', name: 'Other', icon: '📦' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
