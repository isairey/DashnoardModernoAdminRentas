import { motion } from 'framer-motion';
import {
  FiBook,
  FiCode,
  FiLifeBuoy,
  FiVideo,
  FiFileText,
  FiMessageCircle,
  FiArrowRight,
  FiDownload,
  FiExternalLink,
} from 'react-icons/fi';

const DocCard = ({ doc, index }) => {
  return (
    <motion.a
      href={doc.link}
      target={doc.external ? "_blank" : "_self"}
      rel={doc.external ? "noopener noreferrer" : ""}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 transition-all duration-300 hover:shadow-xl"
    >
      {/* Icon */}
      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-300">
        <doc.icon className="w-7 h-7 text-gray-900 group-hover:text-white transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-black">
          {doc.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {doc.description}
        </p>
      </div>

      {/* Meta info */}
      {doc.meta && (
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {doc.meta.time && (
            <span className="flex items-center gap-1">
              <FiVideo className="w-4 h-4" />
              {doc.meta.time}
            </span>
          )}
          {doc.meta.pages && (
            <span className="flex items-center gap-1">
              <FiFileText className="w-4 h-4" />
              {doc.meta.pages}
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center gap-2 text-gray-900 font-medium group-hover:gap-3 transition-all">
        <span>{doc.cta}</span>
        {doc.external ? (
          <FiExternalLink className="w-4 h-4" />
        ) : (
          <FiArrowRight className="w-4 h-4" />
        )}
      </div>

      {/* Badge */}
      {doc.badge && (
        <div className="absolute top-6 right-6 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {doc.badge}
        </div>
      )}
    </motion.a>
  );
};

const QuickLink = ({ link, index }) => {
  return (
    <motion.a
      href={link.url}
      target={link.external ? "_blank" : "_self"}
      rel={link.external ? "noopener noreferrer" : ""}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <link.icon className="w-5 h-5 text-gray-600" />
        <span className="text-gray-900 font-medium">{link.title}</span>
      </div>
      <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
    </motion.a>
  );
};

const DocsSection = () => {
  const docs = [
    {
      icon: FiBook,
      title: 'Getting Started Guide',
      description: 'Learn the basics and get your rental management system up and running in minutes.',
      meta: { time: '10 min read', pages: '12 pages' },
      cta: 'Read guide',
      link: '#',
      badge: 'Popular',
    },
    {
      icon: FiCode,
      title: 'API Documentation',
      description: 'Complete API reference with code examples for integrating with your existing systems.',
      meta: { pages: '50+ endpoints' },
      cta: 'View API docs',
      link: '#',
      external: true,
    },
    {
      icon: FiVideo,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides covering everything from setup to advanced features.',
      meta: { time: '2 hours', pages: '15 videos' },
      cta: 'Watch tutorials',
      link: '#',
    },
    {
      icon: FiLifeBuoy,
      title: 'Help Center',
      description: 'Browse FAQs, troubleshooting guides, and solutions to common questions.',
      cta: 'Get help',
      link: '#',
    },
    {
      icon: FiFileText,
      title: 'Best Practices',
      description: 'Learn industry best practices for property management and tenant relations.',
      cta: 'Read more',
      link: '#',
    },
    {
      icon: FiMessageCircle,
      title: 'Community Forum',
      description: 'Connect with other users, share tips, and get answers from the community.',
      cta: 'Join forum',
      link: '#',
      external: true,
    },
  ];

  const quickLinks = [
    { icon: FiDownload, title: 'Download Mobile App', url: '#' },
    { icon: FiBook, title: 'Release Notes', url: '#' },
    { icon: FiCode, title: 'Developer Portal', url: '#', external: true },
    { icon: FiLifeBuoy, title: 'Contact Support', url: '#' },
  ];

  return (
    <section id="docs" className="relative bg-gray-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
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
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 mb-6"
          >
            <FiBook className="w-4 h-4" />
            Documentation & Resources
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive guides, tutorials, and resources to help you get the most out of RentalHub.
          </p>
        </motion.div>

        {/* Main docs grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {docs.map((doc, index) => (
            <DocCard key={index} doc={doc} index={index} />
          ))}
        </div>

        {/* Quick links section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white border border-gray-200 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Quick Links</h3>
            <span className="text-sm text-gray-500">Popular resources</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <QuickLink key={index} link={link} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiMessageCircle className="w-5 h-5" />
                Contact Support
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/20 rounded-lg hover:border-white/40 transition-colors"
              >
                <FiBook className="w-5 h-5" />
                Browse All Docs
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DocsSection;
