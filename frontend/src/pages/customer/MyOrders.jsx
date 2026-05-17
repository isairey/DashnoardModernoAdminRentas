import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../../slices/orderSlice';
import {
  FiPackage,
  FiCalendar,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi';

// ============================================================================
// ENTERPRISE ORDERS PAGE - Clean SaaS Design
// ============================================================================

// Status Configuration
const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: FiClock,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: FiCheckCircle,
  },
  processing: {
    label: 'Processing',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: FiRefreshCw,
  },
  'ready-for-pickup': {
    label: 'Ready for Pickup',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: FiPackage,
  },
  'picked-up': {
    label: 'Picked Up',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: FiTruck,
  },
  active: {
    label: 'Active',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: FiCheckCircle,
  },
  returned: {
    label: 'Returned',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: FiCheckCircle,
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: FiCheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: FiXCircle,
  },
  overdue: {
    label: 'Overdue',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: FiAlertCircle,
  },
};

// Dummy Orders Data
const dummyOrders = [
  {
    _id: 'ORD001',
    orderNumber: 'ORD-2026-001',
    status: 'active',
    createdAt: '2026-01-28T10:30:00Z',
    rentalPeriod: {
      startDate: '2026-01-28T10:30:00Z',
      endDate: '2026-02-04T10:30:00Z',
    },
    items: [
      {
        product: {
          _id: '1',
          name: 'Sony A7 IV Camera',
          images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100'],
        },
        quantity: 1,
        duration: 7,
        price: 2500,
      },
      {
        product: {
          _id: '4',
          name: 'Canon RF 70-200mm Lens',
          images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100'],
        },
        quantity: 1,
        duration: 7,
        price: 1800,
      },
    ],
    pricing: {
      subtotal: 30100,
      tax: 5418,
      total: 35518,
    },
  },
  {
    _id: 'ORD002',
    orderNumber: 'ORD-2026-002',
    status: 'pending',
    createdAt: '2026-01-30T14:00:00Z',
    rentalPeriod: {
      startDate: '2026-02-01T10:00:00Z',
      endDate: '2026-02-03T10:00:00Z',
    },
    items: [
      {
        product: {
          _id: '2',
          name: 'MacBook Pro 16"',
          images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100'],
        },
        quantity: 1,
        duration: 2,
        price: 3500,
      },
    ],
    pricing: {
      subtotal: 7000,
      tax: 1260,
      total: 8260,
    },
  },
  {
    _id: 'ORD003',
    orderNumber: 'ORD-2026-003',
    status: 'completed',
    createdAt: '2026-01-15T09:00:00Z',
    rentalPeriod: {
      startDate: '2026-01-15T10:00:00Z',
      endDate: '2026-01-22T10:00:00Z',
    },
    items: [
      {
        product: {
          _id: '3',
          name: 'DJI Mavic 3 Pro',
          images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100'],
        },
        quantity: 1,
        duration: 7,
        price: 4500,
      },
    ],
    pricing: {
      subtotal: 31500,
      tax: 5670,
      total: 37170,
    },
  },
  {
    _id: 'ORD004',
    orderNumber: 'ORD-2026-004',
    status: 'ready-for-pickup',
    createdAt: '2026-01-29T16:30:00Z',
    rentalPeriod: {
      startDate: '2026-01-31T10:00:00Z',
      endDate: '2026-02-07T10:00:00Z',
    },
    items: [
      {
        product: {
          _id: '5',
          name: 'JBL PartyBox 710',
          images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=100'],
        },
        quantity: 2,
        duration: 7,
        price: 2000,
      },
    ],
    pricing: {
      subtotal: 28000,
      tax: 5040,
      total: 33040,
    },
  },
  {
    _id: 'ORD005',
    orderNumber: 'ORD-2026-005',
    status: 'cancelled',
    createdAt: '2026-01-10T11:00:00Z',
    rentalPeriod: {
      startDate: '2026-01-12T10:00:00Z',
      endDate: '2026-01-14T10:00:00Z',
    },
    items: [
      {
        product: {
          _id: '6',
          name: 'Bosch Power Drill Set',
          images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=100'],
        },
        quantity: 1,
        duration: 2,
        price: 500,
      },
    ],
    pricing: {
      subtotal: 1000,
      tax: 180,
      total: 1180,
    },
  },
];

// Skeleton Components
const OrderRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="px-4 py-4">
      <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
    </td>
    <td className="px-4 py-4">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
      </div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 bg-gray-100 rounded animate-pulse w-28" />
    </td>
    <td className="px-4 py-4">
      <div className="h-6 bg-gray-100 rounded animate-pulse w-20" />
    </td>
    <td className="px-4 py-4">
      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
    </td>
    <td className="px-4 py-4">
      <div className="h-8 bg-gray-100 rounded animate-pulse w-16" />
    </td>
  </tr>
);

// Format currency in INR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

// Tab definitions
const tabs = [
  { id: 'all', label: 'All Orders' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

// Main Orders Component
const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders: storeOrders, isLoading } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  // Use API data if available, otherwise use dummy data for demo
  const apiOrders = storeOrders?.data || storeOrders || [];
  const orders = Array.isArray(apiOrders) && apiOrders.length > 0 ? apiOrders : dummyOrders;

  // Filter orders based on tab and search
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'active' && !['active', 'picked-up', 'ready-for-pickup'].includes(order.status)) {
        return false;
      }
      if (activeTab === 'pending' && !['pending', 'confirmed', 'processing'].includes(order.status)) {
        return false;
      }
      if (activeTab === 'completed' && !['completed', 'returned'].includes(order.status)) {
        return false;
      }
      if (activeTab === 'cancelled' && order.status !== 'cancelled') {
        return false;
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesOrder = order.orderNumber?.toLowerCase().includes(query);
      const matchesProduct = order.items?.some((item) =>
        item.product?.name?.toLowerCase().includes(query)
      );
      if (!matchesOrder && !matchesProduct) return false;
    }

    return true;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    active: orders.filter((o) => ['active', 'picked-up', 'ready-for-pickup'].includes(o.status)).length,
    pending: orders.filter((o) => ['pending', 'confirmed', 'processing'].includes(o.status)).length,
    completed: orders.filter((o) => ['completed', 'returned'].includes(o.status)).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track and manage your rental orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-9 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <FiDownload className="w-4 h-4" />
            Export
          </button>
          <Link
            to="/customer/products"
            className="flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
          >
            New Rental
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, color: 'text-gray-900' },
          { label: 'Active Rentals', value: stats.active, color: 'text-emerald-600' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
          { label: 'Completed', value: stats.completed, color: 'text-blue-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders or products..."
              className="w-full h-9 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-md 
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white"
            />
          </div>
          <span className="text-sm text-gray-500">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rental Period</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {Array(5).fill(0).map((_, i) => <OrderRowSkeleton key={i} />)}
            </tbody>
          </table>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Rental Period</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* Order Number */}
                    <td className="px-4 py-4">
                      <Link to={`/customer/orders/${order._id || order.id}`} className="block">
                        <p className="text-sm font-medium text-gray-900 hover:text-blue-600">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                      </Link>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 overflow-hidden"
                            >
                              {item.product?.images?.[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FiPackage className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 line-clamp-1">
                            {order.items?.[0]?.product?.name}
                          </p>
                          {order.items?.length > 1 && (
                            <p className="text-xs text-gray-500">
                              +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Rental Period */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(order.rentalPeriod?.startDate)}</span>
                        <span className="text-gray-400">→</span>
                        <span>{formatDate(order.rentalPeriod?.endDate)}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Total */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.pricing?.total || 0)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <FiPackage className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {activeTab !== 'all'
                ? `You don't have any ${activeTab} orders yet`
                : searchQuery
                ? 'Try adjusting your search query'
                : "You haven't placed any orders yet"}
            </p>
            <Link
              to="/customer/products"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>

      {/* Terms & Conditions Footer */}
      <div className="text-center py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          By placing an order, you agree to our{' '}
          <Link
            to="/terms-and-conditions"
            className="text-gray-900 font-medium hover:text-gray-700 underline transition-colors"
          >
            Terms & Conditions
          </Link>
          {' '}and{' '}
          <Link
            to="/privacy-policy"
            className="text-gray-900 font-medium hover:text-gray-700 underline transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default MyOrders;
