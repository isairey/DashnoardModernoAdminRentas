import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, reset } from '../../slices/orderSlice';
import {
  FiArrowLeft,
  FiPackage,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiFileText,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

// Dummy Orders Data (same as MyOrders page)
const dummyOrders = [
  {
    _id: 'ORD001',
    orderNumber: 'ORD-2026-001',
    status: 'active',
    paymentStatus: 'paid',
    createdAt: '2026-01-28T10:30:00Z',
    rentalPeriod: {
      startDate: '2026-01-28T10:30:00Z',
      endDate: '2026-02-04T10:30:00Z',
      duration: 7,
      durationType: 'days',
    },
    items: [
      {
        product: {
          _id: '1',
          name: 'Sony A7 IV Camera',
          images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100'],
        },
        quantity: 1,
        pricePerDay: 2500,
        totalPrice: 17500,
      },
      {
        product: {
          _id: '4',
          name: 'Canon RF 70-200mm Lens',
          images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100'],
        },
        quantity: 1,
        pricePerDay: 1800,
        totalPrice: 12600,
      },
    ],
    pricing: {
      subtotal: 30100,
      securityDeposit: 5000,
      tax: 5418,
      discount: 0,
      total: 40518,
    },
    vendor: {
      name: 'Camera Pro Rentals',
      email: 'contact@camerapro.com',
      phone: '+91 98765 43210',
    },
  },
  {
    _id: 'ORD002',
    orderNumber: 'ORD-2026-002',
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2026-01-30T14:00:00Z',
    rentalPeriod: {
      startDate: '2026-02-01T10:00:00Z',
      endDate: '2026-02-03T10:00:00Z',
      duration: 2,
      durationType: 'days',
    },
    items: [
      {
        product: {
          _id: '2',
          name: 'MacBook Pro 16"',
          images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100'],
        },
        quantity: 1,
        pricePerDay: 3500,
        totalPrice: 7000,
      },
    ],
    pricing: {
      subtotal: 7000,
      securityDeposit: 10000,
      tax: 1260,
      discount: 0,
      total: 18260,
    },
    vendor: {
      name: 'Tech Rentals Hub',
      email: 'info@techrentals.com',
      phone: '+91 98765 12345',
    },
  },
  {
    _id: 'ORD003',
    orderNumber: 'ORD-2026-003',
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2026-01-15T09:00:00Z',
    rentalPeriod: {
      startDate: '2026-01-15T10:00:00Z',
      endDate: '2026-01-22T10:00:00Z',
      duration: 7,
      durationType: 'days',
    },
    items: [
      {
        product: {
          _id: '3',
          name: 'DJI Mavic 3 Pro',
          images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100'],
        },
        quantity: 1,
        pricePerDay: 4500,
        totalPrice: 31500,
      },
    ],
    pricing: {
      subtotal: 31500,
      securityDeposit: 15000,
      tax: 5670,
      discount: 0,
      total: 52170,
    },
    vendor: {
      name: 'Drone World',
      email: 'support@droneworld.com',
      phone: '+91 99887 76655',
    },
  },
  {
    _id: 'ORD004',
    orderNumber: 'ORD-2026-004',
    status: 'ready-for-pickup',
    paymentStatus: 'paid',
    createdAt: '2026-01-29T16:30:00Z',
    rentalPeriod: {
      startDate: '2026-01-31T10:00:00Z',
      endDate: '2026-02-07T10:00:00Z',
      duration: 7,
      durationType: 'days',
    },
    items: [
      {
        product: {
          _id: '5',
          name: 'Canon EOS R5',
          images: ['https://images.unsplash.com/photo-1621259182181-1d7f8d5ab7fe?w=100'],
        },
        quantity: 1,
        pricePerDay: 3200,
        totalPrice: 22400,
      },
    ],
    pricing: {
      subtotal: 22400,
      securityDeposit: 8000,
      tax: 4032,
      discount: 500,
      total: 33932,
    },
    vendor: {
      name: 'Camera Pro Rentals',
      email: 'contact@camerapro.com',
      phone: '+91 98765 43210',
    },
  },
];

// Status configuration
const statusConfig = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: FiClock },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FiCheckCircle },
  'ready-for-pickup': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: FiTruck },
  'picked-up': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: FiPackage },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: FiCheckCircle },
  returned: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: FiPackage },
  completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: FiCheckCircle },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: FiAlertCircle },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  const label = status?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
};

// Skeleton loader
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const OrderDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <SkeletonBox className="h-10 w-10 rounded-lg" />
      <div className="space-y-2">
        <SkeletonBox className="h-6 w-48" />
        <SkeletonBox className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <SkeletonBox className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <SkeletonBox className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-4 w-48" />
                  <SkeletonBox className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <SkeletonBox className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBox key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order: apiOrder, isLoading: apiLoading, isError, message } = useSelector((state) => state.orders);
  const [localOrder, setLocalOrder] = useState(null);

  useEffect(() => {
    // Reset error state on mount
    dispatch(reset());
    
    // First check if it's a dummy order ID
    const dummyOrder = dummyOrders.find(o => o._id === id);
    if (dummyOrder) {
      setLocalOrder(dummyOrder);
    } else if (id) {
      // Fetch from API for real orders
      dispatch(getOrder(id));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  // Use local dummy order or API order
  const order = localOrder || apiOrder;
  const isLoading = !localOrder && apiLoading;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || amount === null || amount === undefined) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const getOrderTotal = () => {
    return Number(order?.totalAmount) || Number(order?.pricing?.total) || 0;
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError && !localOrder) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Order</h2>
          <p className="text-red-600">{message || 'Failed to load order details'}</p>
          <Link
            to="/customer/orders"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-500">The order you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/customer/orders"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Order {order.orderNumber}</h1>
            <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item, index) => (
                <div key={index} className="p-4 flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product?.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FiPackage className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product?.name || item.productName || 'Unknown Product'}
                    </h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.pricePerDay)}/day × {order.rentalPeriod?.duration || 1} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Rental Period</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(order.rentalPeriod?.startDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(order.rentalPeriod?.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FiClock className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.rentalPeriod?.duration || 1} {order.rentalPeriod?.durationType || 'days'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Info */}
          {order.vendor && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Vendor Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {order.vendor?.name?.charAt(0).toUpperCase() || 'V'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.vendor?.name || 'Vendor'}</p>
                  {order.vendor?.email && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FiMail className="w-3.5 h-3.5" />
                      {order.vendor.email}
                    </p>
                  )}
                  {order.vendor?.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FiPhone className="w-3.5 h-3.5" />
                      {order.vendor.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(order.pricing?.subtotal)}</span>
              </div>
              {order.pricing?.securityDeposit > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="text-gray-900">{formatCurrency(order.pricing?.securityDeposit)}</span>
                </div>
              )}
              {order.pricing?.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900">{formatCurrency(order.pricing?.tax)}</span>
                </div>
              )}
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600">-{formatCurrency(order.pricing?.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatCurrency(getOrderTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Payment Status</h2>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                order.paymentStatus === 'paid' ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                {order.paymentStatus === 'paid' ? (
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <FiClock className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {order.paymentStatus || 'Pending'}
                </p>
                <p className="text-xs text-gray-500">
                  {order.paymentStatus === 'paid' ? 'Payment completed' : 'Awaiting payment'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <Link
                to="/customer/orders"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiPackage className="w-4 h-4" />
                View All Orders
              </Link>
              <Link
                to="/customer/invoices"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiFileText className="w-4 h-4" />
                View Invoices
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
