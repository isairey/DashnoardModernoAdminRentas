const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companyMembershipSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'vendor', 'staff'],
    default: 'vendor'
  },
  permissions: [{
    type: String
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'vendor', 'customer'],
    default: 'customer'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date
  },
  // Last login tracking
  lastLogin: {
    type: Date
  },
  // Multi-tenant support: user can belong to multiple companies
  companyMemberships: [companyMembershipSchema],
  // Currently active company (for session context)
  activeCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  vendorInfo: {
    businessName: String,
    businessDescription: String,
    isApproved: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Skip hashing if password is not modified or not set
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user's companies
userSchema.methods.getCompanies = function() {
  return this.companyMemberships.filter(m => m.isActive).map(m => m.company);
};

// Check if user belongs to a company
userSchema.methods.belongsToCompany = function(companyId) {
  return this.companyMemberships.some(
    m => m.company.toString() === companyId.toString() && m.isActive
  );
};

// Get user's role in a specific company
userSchema.methods.getRoleInCompany = function(companyId) {
  const membership = this.companyMemberships.find(
    m => m.company.toString() === companyId.toString() && m.isActive
  );
  return membership ? membership.role : null;
};

module.exports = mongoose.model('User', userSchema);
