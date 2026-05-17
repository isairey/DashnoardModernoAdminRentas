import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiTool,
  FiBarChart2,
  FiShield,
} from 'react-icons/fi';

const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"
        animate={{
          opacity: isHovered ? 0.6 : 0,
        }}
      />

      {/* Card */}
      <div className="relative bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-xl">
        {/* Icon container with gradient background */}
        <motion.div
          className="relative w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <feature.icon className="w-7 h-7 text-white relative z-10" />
        </motion.div>

        {/* Content */}
        <div style={{ transform: 'translateZ(20px)' }}>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-black transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            {feature.description}
          </p>
        </div>

        {/* Decorative corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: 'translateZ(10px)' }}
        />
      </div>
    </motion.div>
  );
};

const PremiumFeatures = () => {
  const features = [
    {
      icon: FiHome,
      title: 'Property Management',
      description: 'Track all property details, units, and documentation in one centralized platform.',
    },
    {
      icon: FiUsers,
      title: 'Tenant & Lease Tracking',
      description: 'Manage tenant profiles, lease agreements, and renewal workflows seamlessly.',
    },
    {
      icon: FiCreditCard,
      title: 'Rent & Payment Collection',
      description: 'Automate rent collection with multiple payment methods and smart reminders.',
    },
    {
      icon: FiTool,
      title: 'Maintenance Requests',
      description: 'Handle maintenance tickets from submission to resolution with full tracking.',
    },
    {
      icon: FiBarChart2,
      title: 'Reports & Analytics',
      description: 'Generate comprehensive financial reports, occupancy metrics, and insights.',
    },
    {
      icon: FiShield,
      title: 'Role-Based Access',
      description: 'Control permissions for owners, managers, and maintenance staff securely.',
    },
  ];

  return (
    <section id="features" className="relative bg-white overflow-hidden">
      {/* Sophisticated background */}
      <div className="absolute inset-0">
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
        
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Radial gradient accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
            Platform Features
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Everything you need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive tools to manage your rental business efficiently and scale with confidence.
          </p>
        </motion.div>

        {/* Features Grid with staggered layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm">
            And much more — explore all features in our{' '}
            <a href="#" className="text-gray-900 font-medium hover:underline">
              documentation
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumFeatures;
