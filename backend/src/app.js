const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const otpRoutes = require('./routes/otp.routes');
const emailVerificationRoutes = require('./routes/emailVerification.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Body parser - increase limit for image uploads (base64 encoded)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS for production and development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', otpRoutes);
app.use('/api/email-verification', emailVerificationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
