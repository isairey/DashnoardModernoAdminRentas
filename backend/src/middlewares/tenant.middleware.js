const Company = require('../models/Company');

/**
 * Tenant Context Middleware
 * Extracts and validates company context from JWT or request
 * Attaches tenant context to req.tenant for use in controllers
 */
exports.tenantContext = async (req, res, next) => {
  try {
    // Skip tenant context for public routes
    if (!req.user) {
      return next();
    }

    // Get companyId from various sources (priority order)
    let companyId = 
      req.headers['x-company-id'] ||  // Header override
      req.query.companyId ||           // Query param
      req.user.activeCompany;          // User's active company

    // If no company specified and user has memberships, use default
    if (!companyId && req.user.companyMemberships?.length > 0) {
      const defaultMembership = req.user.companyMemberships.find(m => m.isDefault && m.isActive);
      companyId = defaultMembership?.company || req.user.companyMemberships[0]?.company;
    }

    // Customers can access without company context (they see public products)
    if (!companyId && req.user.role === 'customer') {
      req.tenant = null;
      return next();
    }

    // Validate company exists and user has access
    if (companyId) {
      const company = await Company.findById(companyId);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      if (!company.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Company is inactive'
        });
      }

      // Verify user belongs to this company (skip for superadmin)
      if (req.user.role !== 'superadmin') {
        const membership = req.user.companyMemberships?.find(
          m => m.company.toString() === companyId.toString() && m.isActive
        );

        if (!membership && req.user.role !== 'customer') {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to this company'
          });
        }

        // Attach role within company context
        req.companyRole = membership?.role || 'customer';
      }

      // Attach tenant context
      req.tenant = {
        companyId: company._id,
        company: company,
        isTestCompany: company.isTestCompany
      };
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error establishing tenant context',
      error: error.message
    });
  }
};

/**
 * Require Company Context Middleware
 * Use this for routes that MUST have a company selected
 */
exports.requireCompany = (req, res, next) => {
  if (!req.tenant?.companyId) {
    return res.status(400).json({
      success: false,
      message: 'Company context required. Please select a company first.',
      code: 'COMPANY_REQUIRED'
    });
  }
  next();
};

/**
 * Company Owner/Admin Only Middleware
 */
exports.companyAdmin = (req, res, next) => {
  if (!['owner', 'admin'].includes(req.companyRole) && req.user.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Company admin access required'
    });
  }
  next();
};

/**
 * Build tenant-scoped query filter
 * Use this in controllers to automatically scope queries
 */
exports.buildTenantQuery = (req, baseQuery = {}) => {
  const query = { ...baseQuery };
  
  if (req.tenant?.companyId) {
    query.company = req.tenant.companyId;
  }
  
  return query;
};

/**
 * Scope data for vendor - only their own data within company
 */
exports.buildVendorQuery = (req, baseQuery = {}) => {
  const query = exports.buildTenantQuery(req, baseQuery);
  
  if (req.user.role === 'vendor' || req.companyRole === 'vendor') {
    query.vendor = req.user._id;
  }
  
  return query;
};
