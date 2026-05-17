import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  FiHome,
  FiUsers,
  FiArrowRight,
  FiCheck,
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiActivity,
} from 'react-icons/fi';

const EliteHero = ({ isAuthenticated }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Sophisticated Background Layer */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 opacity-[0.02]"
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Radial gradient overlays */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div style={{ opacity }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium mb-8 shadow-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Trusted by 10,000+ property managers
            </motion.div>
            
            {/* Heading with reveal animation */}
            <div className="mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.15] tracking-tight pb-2"
              >
                The modern way to{' '}
                <span className="relative inline-block pb-1">
                  <span className="relative z-10">manage rentals</span>
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-3 bg-yellow-200 -z-10"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                  />
                </span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg"
            >
              Complete platform for property management, tenant relations, and payments. Built for teams that need reliability at scale.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-black rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Start free trial</span>
                <FiArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-900 transition-all duration-300"
              >
                <span>View demo</span>
                <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-6 text-sm text-gray-500"
            >
              {['No credit card required', '14-day free trial', 'Cancel anytime'].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiCheck className="w-3 h-3 text-gray-900" />
                  </div>
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Floating Product Visuals */}
          <div className="relative h-[600px] lg:h-[700px]">
            {/* Main Dashboard Card - Center */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{ y: y1 }}
              className="absolute top-[40%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-1">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Dashboard Overview</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Properties', value: '248', icon: FiHome, color: 'indigo' },
                      { label: 'Tenants', value: '1,429', icon: FiUsers, color: 'purple' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <stat.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Chart placeholder */}
                  <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-end justify-around p-4">
                    {[40, 70, 45, 80, 60, 90, 75].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                        className="w-8 bg-indigo-500 rounded-t"
                        style={{ height: `${height}%`, transformOrigin: 'bottom' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card - Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ y: y2 }}
              className="absolute top-0 left-0 w-64"
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-lg font-bold text-gray-900">₹4.2L</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <FiTrendingUp className="w-3 h-3" />
                  <span>+15% this month</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card - Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{ y: y1 }}
              className="absolute top-20 right-0 w-56"
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Upcoming</p>
                    <p className="text-lg font-bold text-gray-900">12 Tasks</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      <div className="h-2 bg-gray-100 rounded flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating Card - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              style={{ y: y2 }}
              className="absolute bottom-20 left-8 w-60"
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiActivity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Now</p>
                    <p className="text-lg font-bold text-gray-900">847</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white -ml-2 first:ml-0" />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">+843</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              style={{ y: y1 }}
              className="absolute bottom-0 right-8 w-52"
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">Payment Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Paid</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold text-gray-900">₹25,000</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 1.5, duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default EliteHero;
