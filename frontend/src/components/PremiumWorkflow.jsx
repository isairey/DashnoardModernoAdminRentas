import { motion } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiBarChart2,
  FiArrowRight,
  FiCheck,
} from 'react-icons/fi';

const WorkflowStep = ({ step, index, isReversed }) => {
  return (
    <div className="relative">
      {/* Connecting line */}
      {index < 3 && (
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.3, duration: 0.6 }}
          className={`hidden lg:block absolute top-full ${
            isReversed ? 'right-1/2' : 'left-1/2'
          } w-px h-32 bg-gradient-to-b from-gray-300 to-transparent`}
          style={{ transformOrigin: 'top' }}
        />
      )}

      <div
        className={`grid lg:grid-cols-2 gap-12 items-center ${
          isReversed ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
        >
          {/* Step number badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 + 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full font-bold text-lg">
              {step.number}
            </div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Step {step.number}
            </span>
          </motion.div>

          {/* Title */}
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Features list */}
          <ul className="space-y-3 mb-8">
            {step.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.4 + i * 0.1 }}
                className="flex items-center gap-3 text-gray-700"
              >
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheck className="w-3 h-3 text-green-600" />
                </div>
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA link */}
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 + 0.6 }}
            className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all group"
          >
            Learn more
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Image/Visual Side */}
        <motion.div
          initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: index * 0.2 + 0.1, duration: 0.6 }}
          className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <div className="relative group">
            {/* Main card container */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:border-gray-300">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl flex items-center justify-center mb-6">
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Mock interface */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full" />
                    <div>
                      <div className="h-3 w-24 bg-gray-200 rounded mb-1.5" />
                      <div className="h-2 w-16 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-200 rounded-full" />
                    <div className="w-2 h-2 bg-gray-200 rounded-full" />
                    <div className="w-2 h-2 bg-gray-200 rounded-full" />
                  </div>
                </div>

                {/* Content rows */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.8 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCheck className="w-3 h-3 text-green-600" />
                    </div>
                  </motion.div>
                ))}

                {/* Action button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 1.2 }}
                  className="pt-4"
                >
                  <div className="h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="h-2.5 w-20 bg-white/20 rounded" />
                  </div>
                </motion.div>
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent opacity-50 rounded-2xl" />
            </div>

            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.4, type: "spring" }}
              className="absolute -bottom-4 -right-4 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="h-2 w-16 bg-gray-200 rounded mb-1.5" />
                  <div className="h-2.5 w-12 bg-gray-900 rounded" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const PremiumWorkflow = () => {
  const steps = [
    {
      number: '01',
      title: 'Add properties',
      description:
        'Import or add your properties with all relevant details, documents, and unit information. Our intuitive interface makes property onboarding quick and easy.',
      features: [
        'Bulk import from CSV or Excel',
        'Document management system',
        'Unit and floor plan tracking',
      ],
      icon: FiHome,
    },
    {
      number: '02',
      title: 'Assign tenants',
      description:
        'Create comprehensive tenant profiles and link them to units with detailed lease terms. Manage all tenant information in one centralized location.',
      features: [
        'Digital lease agreements',
        'Tenant screening integration',
        'Automated move-in checklists',
      ],
      icon: FiUsers,
    },
    {
      number: '03',
      title: 'Track rent & maintenance',
      description:
        'Monitor payments, send automated reminders, and manage maintenance requests efficiently. Keep everything organized and on schedule.',
      features: [
        'Automated payment reminders',
        'Maintenance ticket system',
        'Real-time payment tracking',
      ],
      icon: FiCreditCard,
    },
    {
      number: '04',
      title: 'Generate reports',
      description:
        'Export comprehensive financial statements, occupancy reports, and analytics. Make data-driven decisions with powerful insights.',
      features: [
        'Custom report builder',
        'Financial analytics dashboard',
        'Export to PDF or Excel',
      ],
      icon: FiBarChart2,
    },
  ];

  return (
    <section id="how-it-works" className="relative bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
            Simple Process
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get started in minutes with our simple, intuitive setup process. No technical expertise required.
          </p>
        </motion.div>

        {/* Steps - Alternating layout */}
        <div className="space-y-32 lg:space-y-48">
          {steps.map((step, index) => (
            <WorkflowStep
              key={index}
              step={step}
              index={index}
              isReversed={index % 2 !== 0}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-20"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start your free trial
              <FiArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-900 transition-colors"
            >
              Schedule a demo
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumWorkflow;
