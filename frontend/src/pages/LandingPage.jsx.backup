import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiTool,
  FiBarChart2,
  FiShield,
  FiArrowRight,
  FiCheck,
  FiBox,
  FiFileText,
  FiBriefcase,
  FiLayers,
} from 'react-icons/fi';

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const Navbar = ({ isAuthenticated, getDashboardLink }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">RentalHub</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#solutions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Solutions
          </a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Docs
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={getDashboardLink()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            >
              Dashboard
              <FiArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
);

const Hero = ({ isAuthenticated }) => (
  <section className="bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight tracking-tight">
            Modern Rental Management Software for Growing Businesses
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Manage properties, tenants, payments, and maintenance from a single, unified platform. 
            Built for teams that need reliability at scale.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            >
              Start free trial
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              View demo
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required · 14-day free trial
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white border border-gray-200 rounded px-3 py-1 text-xs text-gray-400">
                  app.rentalhub.com/dashboard
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-4 bg-gray-50">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">R</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="text-xs text-gray-500 mb-1">Total Properties</p>
                  <p className="text-lg font-semibold text-gray-900">248</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="text-xs text-gray-500 mb-1">Active Tenants</p>
                  <p className="text-lg font-semibold text-gray-900">1,429</p>
                  <p className="text-xs text-green-600">+8% this month</p>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="text-xs text-gray-500 mb-1">Revenue</p>
                  <p className="text-lg font-semibold text-gray-900">₹4.2L</p>
                  <p className="text-xs text-green-600">+15% this month</p>
                </div>
              </div>

              {/* Table Preview */}
              <div className="bg-white border border-gray-200 rounded">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-900">Recent Payments</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { name: 'Rahul Sharma', unit: 'Unit A-101', amount: '₹25,000', status: 'Paid' },
                    { name: 'Priya Patel', unit: 'Unit B-204', amount: '₹18,500', status: 'Paid' },
                    { name: 'Amit Kumar', unit: 'Unit C-302', amount: '₹22,000', status: 'Pending' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full" />
                        <div>
                          <p className="text-xs font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-900">{item.amount}</p>
                        <p className={`text-xs ${item.status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Stats = () => {
  const metrics = [
    { value: '50,000+', label: 'Properties managed' },
    { value: '120,000+', label: 'Active tenants' },
    { value: '98.5%', label: 'On-time payments' },
    { value: '99.9%', label: 'System uptime' },
  ];

  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md p-6 text-center"
            >
              <div className="text-2xl lg:text-3xl font-semibold text-gray-900">
                {metric.value}
              </div>
              <div className="mt-1 text-sm text-gray-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: FiHome,
      title: 'Property Management',
      description: 'Track all property details, units, and documentation in one place.',
    },
    {
      icon: FiUsers,
      title: 'Tenant & Lease Tracking',
      description: 'Manage tenant profiles, lease agreements, and renewal workflows.',
    },
    {
      icon: FiCreditCard,
      title: 'Rent & Payment Collection',
      description: 'Automate rent collection with multiple payment methods and reminders.',
    },
    {
      icon: FiTool,
      title: 'Maintenance Requests',
      description: 'Handle maintenance tickets from submission to resolution efficiently.',
    },
    {
      icon: FiBarChart2,
      title: 'Reports & Analytics',
      description: 'Generate financial reports, occupancy metrics, and business insights.',
    },
    {
      icon: FiShield,
      title: 'Role-Based Access',
      description: 'Control permissions for owners, managers, and maintenance staff.',
    },
  ];

  return (
    <section id="features" className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900">Core Features</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage rental operations efficiently.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Workflow = () => {
  const steps = [
    {
      number: '01',
      title: 'Add properties',
      description: 'Import or add your properties with all relevant details and documents.',
    },
    {
      number: '02',
      title: 'Assign tenants',
      description: 'Create tenant profiles and link them to units with lease terms.',
    },
    {
      number: '03',
      title: 'Track rent & maintenance',
      description: 'Monitor payments, send reminders, and manage maintenance requests.',
    },
    {
      number: '04',
      title: 'Generate reports',
      description: 'Export financial statements, occupancy reports, and analytics.',
    },
  ];

  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900">How It Works</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with a simple setup process.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white border border-gray-200 rounded-md p-6">
                <div className="text-xs font-medium text-gray-400 mb-3">
                  STEP {step.number}
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TargetUsers = () => {
  const users = [
    {
      icon: FiHome,
      title: 'Property Owners',
      description: 'Individual landlords managing one or multiple properties.',
    },
    {
      icon: FiBriefcase,
      title: 'Rental Businesses',
      description: 'Property management companies with large portfolios.',
    },
    {
      icon: FiLayers,
      title: 'Facility Managers',
      description: 'Teams handling commercial or residential complexes.',
    },
    {
      icon: FiUsers,
      title: 'Real Estate Teams',
      description: 'Agencies offering rental management services.',
    },
  ];

  return (
    <section id="solutions" className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900">Built For</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Designed to scale with businesses of all sizes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-md text-center"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
                <user.icon className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {user.title}
              </h3>
              <p className="text-sm text-gray-600">{user.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = ({ isAuthenticated }) => (
  <section className="bg-gray-900">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 className="text-2xl lg:text-3xl font-semibold text-white">
        Everything you need to run rentals at scale
      </h2>
      <p className="mt-4 text-gray-400">
        Start managing smarter today.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to={isAuthenticated ? '/customer/dashboard' : '/register'}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-100 transition-colors"
        >
          Get started
        </Link>
        <a
          href="#"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
        >
          Contact sales
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Product */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Product</h4>
          <ul className="space-y-3">
            <li>
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Roadmap
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Changelog
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Company</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Resources</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                API Reference
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Status
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Legal</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Security
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="text-sm text-gray-500">
            © {new Date().getFullYear()} RentalHub. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================================

const LandingPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'vendor') return '/vendor/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar isAuthenticated={isAuthenticated} getDashboardLink={getDashboardLink} />
      <Hero isAuthenticated={isAuthenticated} />
      <Stats />
      <Features />
      <Workflow />
      <TargetUsers />
      <CTA isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
};

export default LandingPage;
