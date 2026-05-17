import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../slices/orderSlice';
import { getProducts } from '../../slices/productSlice';
import {
  FiPackage,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTruck,
  FiFileText,
  FiArrowRight,
  FiChevronRight,
  FiRefreshCw,
  FiShoppingBag,
  FiAlertTriangle,
  FiEye,
  FiTrendingUp,
  FiGrid,
} from 'react-icons/fi';

// ============================================
// SKELETON LOADERS
// ============================================
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const KPICardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-5">
    <div className="flex items-start justify-between">
      <div className="space-y-3 flex-1">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-8 w-16" />
        <SkeletonBox className="h-3 w-32" />
      </div>
      <SkeletonBox className="h-10 w-10 rounded-lg" />
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-20" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-32" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-24" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-6 w-20 rounded-full" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-16" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-8" /></td>
  </tr>
);

// ============================================
// EMPTY STATES
// ============================================
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-gray-400" />
    </div>
    <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 text-center max-w-sm mb-4">{description}</p>
    {action && (
      <Link
        to={action.href}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
      >
        {action.label}
        <FiArrowRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

// ============================================
// STATUS BADGE
// ============================================
const statusConfig = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'ready-for-pickup': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  'picked-up': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  returned: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  overdue: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  unpaid: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const label = status.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {label}
    </span>
  );
};

// ============================================
// DUMMY DATA FOR DEMO
// ============================================
const dummyOrders = [
  {
    _id: 'ORD-2026-001',
    orderNumber: 'ORD-2026-001',
    items: [{ product: { name: 'Sony Alpha a7 III' }, quantity: 1 }],
    totalAmount: 7500,
    status: 'active',
    rentalPeriod: { startDate: '2026-01-28', endDate: '2026-02-03' },
    createdAt: '2026-01-28T10:30:00Z',
  },
  {
    _id: 'ORD-2026-002',
    orderNumber: 'ORD-2026-002',
    items: [{ product: { name: 'DJI Mavic 3 Pro' }, quantity: 1 }, { product: { name: 'DJI RS 3 Pro Gimbal' }, quantity: 1 }],
    totalAmount: 15600,
    status: 'picked-up',
    rentalPeriod: { startDate: '2026-01-25', endDate: '2026-01-31' },
    createdAt: '2026-01-24T14:20:00Z',
  },
  {
    _id: 'ORD-2026-003',
    orderNumber: 'ORD-2026-003',
    items: [{ product: { name: 'Canon EOS R5' }, quantity: 1 }],
    totalAmount: 10500,
    status: 'pending',
    rentalPeriod: { startDate: '2026-02-01', endDate: '2026-02-07' },
    createdAt: '2026-01-30T09:15:00Z',
  },
  {
    _id: 'ORD-2025-089',
    orderNumber: 'ORD-2025-089',
    items: [{ product: { name: 'MacBook Pro 16"' }, quantity: 2 }],
    totalAmount: 24000,
    status: 'completed',
    rentalPeriod: { startDate: '2025-12-15', endDate: '2025-12-25' },
    createdAt: '2025-12-14T11:00:00Z',
  },
  {
    _id: 'ORD-2025-078',
    orderNumber: 'ORD-2025-078',
    items: [{ product: { name: 'GoPro Hero 12 Black' }, quantity: 3 }],
    totalAmount: 7200,
    status: 'completed',
    rentalPeriod: { startDate: '2025-11-20', endDate: '2025-11-27' },
    createdAt: '2025-11-19T16:45:00Z',
  },
];

const dummyInvoices = [
  { _id: 'INV-2026-001', invoiceNumber: 'INV-2026-001', amount: 7500, status: 'unpaid', dueDate: '2026-02-05', order: 'ORD-2026-001' },
  { _id: 'INV-2026-002', invoiceNumber: 'INV-2026-002', amount: 15600, status: 'paid', dueDate: '2026-01-30', order: 'ORD-2026-002' },
  { _id: 'INV-2025-089', invoiceNumber: 'INV-2025-089', amount: 24000, status: 'paid', dueDate: '2025-12-20', order: 'ORD-2025-089' },
];

const dummyUpcomingReturns = [
  { orderId: 'ORD-2026-002', product: 'DJI Mavic 3 Pro + Gimbal', returnDate: '2026-01-31', daysLeft: 0 },
  { orderId: 'ORD-2026-001', product: 'Sony Alpha a7 III', returnDate: '2026-02-03', daysLeft: 3 },
];

// ============================================
// KPI CARD COMPONENT
// ============================================
const KPICard = ({ title, value, subtitle, icon: Icon, iconBg = 'bg-gray-100', iconColor = 'text-gray-600', href }) => {
  const content = (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }
  return content;
};

// ============================================
// SECTION HEADER COMPONENT
// ============================================
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
  </div>
);

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders: apiOrders, isLoading: ordersLoading } = useSelector((state) => state.orders);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Use dummy data or API data
  const orders = apiOrders?.length > 0 ? apiOrders : dummyOrders;
  const invoices = dummyInvoices;
  const upcomingReturns = dummyUpcomingReturns;

  useEffect(() => {
    dispatch(getMyOrders());
    // Simulate loading for demo
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Helper to get order total (supports both dummy data and API data)
  const getOrderTotal = (order) => {
    return Number(order?.totalAmount) || Number(order?.pricing?.total) || 0;
  };

  // Calculate KPIs
  const kpis = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeInvoices = Array.isArray(invoices) ? invoices : [];
    
    const activeRentals = safeOrders.filter(o => ['active', 'picked-up'].includes(o.status)).length;
    const pendingOrders = safeOrders.filter(o => ['pending', 'confirmed', 'ready-for-pickup'].includes(o.status)).length;
    const completedRentals = safeOrders.filter(o => o.status === 'completed').length;
    const unpaidInvoices = safeInvoices.filter(i => i.status === 'unpaid');
    const totalUnpaid = unpaidInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const totalSpent = safeOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + getOrderTotal(o), 0);

    return {
      activeRentals,
      pendingOrders,
      completedRentals,
      unpaidCount: unpaidInvoices.length,
      totalUnpaid,
      totalSpent,
      returnsToday: upcomingReturns.filter(r => r.daysLeft === 0).length,
    };
  }, [orders, invoices, upcomingReturns]);

  // Filter orders by tab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders.slice(0, 5);
    if (activeTab === 'active') return orders.filter(o => ['active', 'picked-up'].includes(o.status));
    if (activeTab === 'pending') return orders.filter(o => ['pending', 'confirmed', 'ready-for-pickup'].includes(o.status));
    if (activeTab === 'completed') return orders.filter(o => o.status === 'completed');
    return orders;
  }, [orders, activeTab]);

  const formatDate = (dateString) => {
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

  const getProductSummary = (items) => {
    if (!items || items.length === 0) return 'No items';
    const firstItem = items[0]?.product?.name || 'Unknown Item';
    if (items.length === 1) return firstItem;
    return `${firstItem} +${items.length - 1} more`;
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <SkeletonBox className="h-8 w-48 mb-2" />
            <SkeletonBox className="h-4 w-64" />
          </div>

          {/* KPI Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-100">
                <SkeletonBox className="h-6 w-32" />
              </div>
              <table className="w-full">
                <tbody>
                  {[...Array(4)].map((_, i) => <TableRowSkeleton key={i} />)}
                </tbody>
              </table>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-100">
                <SkeletonBox className="h-6 w-32" />
              </div>
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <SkeletonBox className="h-4 w-32" />
                    <SkeletonBox className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'Customer'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Here's an overview of your rental activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-white transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                to="/customer/products"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FiShoppingBag className="w-4 h-4" />
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Alert Banner - Upcoming Returns */}
        {kpis.returnsToday > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800">
                  {kpis.returnsToday} rental{kpis.returnsToday > 1 ? 's' : ''} due for return today
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Please ensure timely return to avoid late fees.
                </p>
              </div>
              <Link
                to="/customer/orders"
                className="text-sm font-medium text-amber-700 hover:text-amber-800 whitespace-nowrap flex-shrink-0"
              >
                View Details →
              </Link>
            </div>
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Active Rentals"
            value={kpis.activeRentals}
            subtitle="Currently rented items"
            icon={FiPackage}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            href="/customer/orders?status=active"
          />
          <KPICard
            title="Pending Orders"
            value={kpis.pendingOrders}
            subtitle="Awaiting confirmation or pickup"
            icon={FiClock}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            href="/customer/orders?status=pending"
          />
          <KPICard
            title="Outstanding Amount"
            value={formatCurrency(kpis.totalUnpaid)}
            subtitle={`${kpis.unpaidCount} unpaid invoice${kpis.unpaidCount !== 1 ? 's' : ''}`}
            icon={FiFileText}
            iconBg={kpis.totalUnpaid > 0 ? "bg-orange-50" : "bg-gray-50"}
            iconColor={kpis.totalUnpaid > 0 ? "text-orange-600" : "text-gray-500"}
            href="/customer/invoices"
          />
          <KPICard
            title="Total Spent"
            value={formatCurrency(kpis.totalSpent)}
            subtitle="Lifetime rental value"
            icon={FiTrendingUp}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Table - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
                <div className="flex items-center gap-2">
                  {/* Tab Filters */}
                  <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'active', label: 'Active' },
                      { key: 'pending', label: 'Pending' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          activeTab === tab.key
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {filteredOrders.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Order ID</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Items</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden md:table-cell">Period</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Amount</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm text-gray-600 truncate block max-w-[180px]">{getProductSummary(order.items)}</span>
                          </td>
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <span className="text-sm text-gray-500">
                              {formatDate(order.rentalPeriod?.startDate)} — {formatDate(order.rentalPeriod?.endDate)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(getOrderTotal(order))}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => navigate(`/customer/orders/${order._id}`)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                  <Link
                    to="/customer/orders"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
                  >
                    View all orders
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <EmptyState
                icon={FiPackage}
                title="No orders yet"
                description="Start renting equipment to see your orders here"
                action={{ label: 'Browse Catalog', href: '/customer/products' }}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Returns Card */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Upcoming Returns</h2>
              </div>
              {upcomingReturns.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {upcomingReturns.map((item, idx) => (
                    <div key={idx} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.product}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.orderId}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-gray-900">{formatDate(item.returnDate)}</p>
                        <p className={`text-xs font-medium ${item.daysLeft === 0 ? 'text-amber-600' : item.daysLeft <= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                          {item.daysLeft === 0 ? 'Due today' : `${item.daysLeft} days left`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">No upcoming returns</p>
                </div>
              )}
            </div>

            {/* Recent Invoices Card */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Recent Invoices</h2>
                <Link to="/customer/invoices" className="text-xs font-medium text-gray-500 hover:text-gray-700">
                  View all
                </Link>
              </div>
              {invoices.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {invoices.slice(0, 4).map((invoice) => (
                    <div key={invoice._id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Due {formatDate(invoice.dueDate)}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <StatusBadge status={invoice.status} />
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">No invoices yet</p>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-2">
                {[
                  { label: 'Browse Equipment', icon: FiGrid, href: '/customer/products' },
                  { label: 'View My Orders', icon: FiPackage, href: '/customer/orders' },
                  { label: 'Payment History', icon: FiFileText, href: '/customer/invoices' },
                  { label: 'View Cart', icon: FiShoppingBag, href: '/customer/cart' },
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <action.icon className="w-4 h-4 text-gray-400" />
                    {action.label}
                    <FiChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Section - Activity Summary */}
        <div className="mt-8">
          <SectionHeader
            title="Rental History Summary"
            subtitle="Your rental activity over time"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">This Month</span>
                <span className="text-xs text-gray-400">Jan 2026</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(23100)}</p>
              <p className="text-xs text-gray-500 mt-1">3 orders placed</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Last Month</span>
                <span className="text-xs text-gray-400">Dec 2025</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(24000)}</p>
              <p className="text-xs text-gray-500 mt-1">1 order completed</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Average Order</span>
                <span className="text-xs text-gray-400">All time</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(12960)}</p>
              <p className="text-xs text-gray-500 mt-1">Based on {orders.length} orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
