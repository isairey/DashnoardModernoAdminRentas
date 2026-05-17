const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Delete existing test data
    await User.deleteMany({ email: { $regex: /@example\.com$/ } });
    await Company.deleteMany({ slug: { $in: ['test-company', 'demo-rentals'] } });
    console.log('Existing test data deleted');

    // Create test companies
    const company1 = await Company.create({
      name: 'Test Company',
      slug: 'test-company',
      settings: {
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        taxRate: 18
      },
      subscription: {
        plan: 'professional',
        status: 'active'
      },
      isTestCompany: true
    });
    console.log(`Created company: ${company1.name}`);

    const company2 = await Company.create({
      name: 'Demo Rentals',
      slug: 'demo-rentals',
      settings: {
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        taxRate: 18
      },
      subscription: {
        plan: 'starter',
        status: 'active'
      },
      isTestCompany: true
    });
    console.log(`Created company: ${company2.name}`);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      phone: '+1234567890',
      isActive: true,
      isEmailVerified: true,
      companyMemberships: [{
        company: company1._id,
        role: 'owner',
        isDefault: true,
        permissions: ['all']
      }],
      activeCompany: company1._id
    });
    
    // Update company owner
    company1.owner = admin._id;
    await company1.save();
    
    console.log(`Created admin: ${admin.email}`);

    // Create vendor user
    const vendor = await User.create({
      name: 'Vendor User',
      email: 'vendor@example.com',
      password: 'password123',
      role: 'vendor',
      phone: '+1234567891',
      isActive: true,
      isEmailVerified: true,
      vendorInfo: {
        businessName: 'Test Vendor Business',
        businessAddress: '123 Vendor Street',
        isApproved: true,
      },
      companyMemberships: [{
        company: company1._id,
        role: 'vendor',
        isDefault: true,
        permissions: ['products:manage', 'orders:manage']
      }],
      activeCompany: company1._id
    });
    console.log(`Created vendor: ${vendor.email}`);

    // Create customer user
    const customer = await User.create({
      name: 'Customer User',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
      phone: '+1234567892',
      isActive: true,
      isEmailVerified: true,
    });
    console.log(`Created customer: ${customer.email}`);

    // Create a second admin for demo rentals company
    const admin2 = await User.create({
      name: 'Admin User 2',
      email: 'admin2@example.com',
      password: 'password123',
      role: 'admin',
      phone: '+1234567893',
      isActive: true,
      isEmailVerified: true,
      companyMemberships: [{
        company: company2._id,
        role: 'owner',
        isDefault: true,
        permissions: ['all']
      }],
      activeCompany: company2._id
    });
    
    company2.owner = admin2._id;
    await company2.save();
    
    console.log(`Created admin2: ${admin2.email}`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Test Company:');
    console.log('  Admin:    admin@example.com / password123');
    console.log('  Vendor:   vendor@example.com / password123');
    console.log('Demo Rentals:');
    console.log('  Admin:    admin2@example.com / password123');
    console.log('General:');
    console.log('  Customer: customer@example.com / password123');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
