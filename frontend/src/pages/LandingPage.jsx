import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiTool,
  FiBarChart2,
  FiShield,
  FiArrowRight,
  FiCheck,
  FiBriefcase,
  FiLayers,
  FiZap,
  FiTrendingUp,
} from 'react-icons/fi';
import EliteHero from '../components/EliteHero';
import PremiumFeatures from '../components/PremiumFeatures';
import PremiumWorkflow from '../components/PremiumWorkflow';
import DocsSection from '../components/DocsSection';
import '../styles/landing.css';

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const Navbar = ({ isAuthenticated, getDashboardLink }) => (
  <motion.header 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-lg font-medium text-gray-900">RentalHub</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Solutions', 'Docs'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-gray-600 hover:text-black transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isAuthenticated ? (
            <Link
              to={getDashboardLink()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded hover:bg-gray-800 transition-colors"
            >
              Dashboard
              <FiArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  </motion.header>
);

// Hero component removed - now using EliteHero

const Stats = () => {
  const metrics = [
    { value: '50,000+', label: 'Properties managed', icon: FiHome },
    { value: '120,000+', label: 'Active tenants', icon: FiUsers },
    { value: '98.5%', label: 'On-time payments', icon: FiTrendingUp },
    { value: '99.9%', label: 'System uptime', icon: FiZap },
  ];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  // Old Features component - replaced with PremiumFeatures
  // Keeping for reference if needed
  return null;
};

const Workflow = () => {
  // Old Workflow component - replaced with PremiumWorkflow
  // Keeping for reference if needed
  return null;
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
    <section id="solutions" className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Built for everyone</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Designed to scale with businesses of all sizes.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {users.map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <user.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {user.title}
              </h3>
              <p className="text-gray-600 text-sm">{user.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = ({ isAuthenticated }) => (
  <section className="bg-gray-900">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl text-gray-400 mb-10">
          Join thousands of property managers who trust RentalHub.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? '/customer/dashboard' : '/register'}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-medium text-gray-900 bg-white rounded hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
            Get started for free
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white border border-gray-700 rounded hover:border-gray-600 transition-colors w-full sm:w-auto"
          >
            Schedule a demo
          </a>
        </div>
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4" />
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
        {/* Product */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
          <ul className="space-y-3">
            {['Features', 'Pricing', 'Roadmap', 'Changelog'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-3">
            {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
          <ul className="space-y-3">
            {['Documentation', 'Help Center', 'API Reference', 'Status'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
          <ul className="space-y-3">
            {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-sm text-gray-600">
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
      <EliteHero isAuthenticated={isAuthenticated} />
      <Stats />
      <PremiumFeatures />
      <PremiumWorkflow />
      <TargetUsers />
      <DocsSection />
      <CTA isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
};

export default LandingPage;
