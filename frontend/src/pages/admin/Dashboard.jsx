import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getAllOrders, getOrderStats } from '../../slices/orderSlice';
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
  FiChevronRight,
  FiRefreshCw,
  FiAlertTriangle,
  FiEye,
  FiSettings,
  FiBarChart2,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
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
    customer: { name: 'John Smith', email: 'john@example.com' },
    items: [{ product: { name: 'Sony Alpha a7 III' }, quantity: 1 }],
    pricing: { total: 7500 },
    status: 'active',
    createdAt: '2026-01-28T10:30:00Z',
  },
  {
    _id: 'ORD-2026-002',
    orderNumber: 'ORD-2026-002',
    customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
    items: [{ product: { name: 'DJI Mavic 3 Pro' }, quantity: 1 }],
    pricing: { total: 15600 },
    status: 'pending',
    createdAt: '2026-01-30T14:20:00Z',
  },
  {
    _id: 'ORD-2026-003',
    orderNumber: 'ORD-2026-003',
    customer: { name: 'Mike Chen', email: 'mike@example.com' },
    items: [{ product: { name: 'Canon EOS R5' }, quantity: 1 }],
    pricing: { total: 10500 },
    status: 'completed',
    createdAt: '2026-01-25T09:15:00Z',
  },
  {
    _id: 'ORD-2026-004',
    orderNumber: 'ORD-2026-004',
    customer: { name: 'Emily Davis', email: 'emily@example.com' },
    items: [{ product: { name: 'MacBook Pro 16"' }, quantity: 2 }],
    pricing: { total: 24000 },
    status: 'picked-up',
    createdAt: '2026-01-29T11:00:00Z',
  },
  {
    _id: 'ORD-2026-005',
    orderNumber: 'ORD-2026-005',
    customer: { name: 'David Wilson', email: 'david@example.com' },
    items: [{ product: { name: 'GoPro Hero 12 Black' }, quantity: 3 }],
    pricing: { total: 7200 },
    status: 'confirmed',
    createdAt: '2026-01-31T08:45:00Z',
  },
];

const dummyVendorRequests = [
  { _id: '1', name: 'Tech Rentals Inc', email: 'tech@rentals.com', submittedAt: '2026-01-30' },
  { _id: '2', name: 'Camera Pro Shop', email: 'info@camerapro.com', submittedAt: '2026-01-29' },
];

// ============================================
// KPI CARD COMPONENT
// ============================================
const KPICard = ({ title, value, subtitle, icon: Icon, iconBg = 'bg-gray-100', iconColor = 'text-gray-600', trend, trendUp, href }) => {
  const content = (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 pt-1">
              <FiTrendingUp className={`w-3 h-3 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`} />
              <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
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
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders: apiOrders, stats, isLoading: ordersLoading } = useSelector((state) => state.orders);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Use dummy data or API data
  const orders = apiOrders?.length > 0 ? apiOrders : dummyOrders;
  const vendorRequests = dummyVendorRequests;

  useEffect(() => {
    dispatch(getAllOrders({ limit: 10 }));
    dispatch(getOrderStats());
    // Simulate loading for demo
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalRevenue = stats?.totalRevenue || orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const totalOrders = stats?.totalOrders || orders.length;
    const activeRentals = stats?.byStatus?.find((s) => s._id === 'active')?.count || orders.filter(o => o.status === 'active').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return {
      totalRevenue,
      totalOrders,
      activeRentals,
      pendingOrders,
      totalUsers: 1234,
      totalVendors: 156,
      pendingVendors: vendorRequests.length,
    };
  }, [orders, stats, vendorRequests]);

  // Filter orders by tab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders.slice(0, 5);
    if (activeTab === 'active') return orders.filter(o => o.status === 'active');
    if (activeTab === 'pending') return orders.filter(o => o.status === 'pending');
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Overview of your rental platform
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
                to="/admin/analytics"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FiBarChart2 className="w-4 h-4" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Alert Banner - Pending Vendor Requests */}
        {kpis.pendingVendors > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800">
                  {kpis.pendingVendors} vendor request{kpis.pendingVendors > 1 ? 's' : ''} pending approval
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Review and approve vendor applications to expand your marketplace.
                </p>
              </div>
              <Link
                to="/admin/users"
                className="text-sm font-medium text-amber-700 hover:text-amber-800 whitespace-nowrap flex-shrink-0"
              >
                Review Now →
              </Link>
            </div>
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(kpis.totalRevenue)}
            trend="+12.5%"
            trendUp={true}
            icon={FiDollarSign}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <KPICard
            title="Total Orders"
            value={kpis.totalOrders}
            trend="+8.2%"
            trendUp={true}
            icon={FiShoppingCart}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            href="/admin/orders"
          />
          <KPICard
            title="Active Rentals"
            value={kpis.activeRentals}
            subtitle="Currently rented out"
            icon={FiPackage}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />
          <KPICard
            title="Total Users"
            value={kpis.totalUsers.toLocaleString()}
            subtitle={`${kpis.totalVendors} vendors`}
            icon={FiUsers}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            href="/admin/users"
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
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Customer</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden md:table-cell">Date</th>
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
                            <div>
                              <span className="text-sm font-medium text-gray-900">{order.customer?.name}</span>
                              <p className="text-xs text-gray-500">{order.customer?.email}</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(order.pricing?.total)}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
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
                    to="/admin/orders"
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
                description="Orders will appear here once customers start renting"
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Orders by Status Card */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Orders by Status</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { status: 'pending', count: kpis.pendingOrders, icon: FiClock, color: 'text-amber-500' },
                  { status: 'active', count: kpis.activeRentals, icon: FiPackage, color: 'text-emerald-500' },
                  { status: 'completed', count: orders.filter(o => o.status === 'completed').length, icon: FiCheckCircle, color: 'text-green-500' },
                  { status: 'cancelled', count: orders.filter(o => o.status === 'cancelled').length, icon: FiAlertCircle, color: 'text-red-500' },
                ].map((item, idx) => (
                  <div key={idx} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm font-medium text-gray-700 capitalize">{item.status}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Vendor Approvals Card */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Vendor Requests</h2>
                <Link to="/admin/users" className="text-xs font-medium text-gray-500 hover:text-gray-700">
                  View all
                </Link>
              </div>
              {vendorRequests.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {vendorRequests.map((vendor) => (
                    <div key={vendor._id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{vendor.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{vendor.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(vendor.submittedAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">No pending requests</p>
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
                  { label: 'Manage Users', icon: FiUsers, href: '/admin/users' },
                  { label: 'View Products', icon: FiPackage, href: '/admin/products' },
                  { label: 'View Invoices', icon: FiFileText, href: '/admin/invoices' },
                  { label: 'Settings', icon: FiSettings, href: '/admin/settings' },
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

        {/* Secondary Section - Platform Stats */}
        <div className="mt-8">
          <SectionHeader
            title="Platform Overview"
            subtitle="Key metrics for your rental marketplace"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">This Month</span>
                <span className="text-xs text-gray-400">Jan 2026</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(125000)}</p>
              <p className="text-xs text-gray-500 mt-1">45 orders completed</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Last Month</span>
                <span className="text-xs text-gray-400">Dec 2025</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(98000)}</p>
              <p className="text-xs text-gray-500 mt-1">38 orders completed</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Average Order</span>
                <span className="text-xs text-gray-400">All time</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(12960)}</p>
              <p className="text-xs text-gray-500 mt-1">Based on {kpis.totalOrders} orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
