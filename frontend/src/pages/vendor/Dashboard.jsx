import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchVendorDashboard, selectVendorDashboard } from '../../slices/dashboardSlice';
import {
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiArrowRight,
  FiChevronRight,
  FiRefreshCw,
  FiAlertTriangle,
  FiEye,
  FiPlus,
  FiBarChart2,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiSettings,
  FiEdit2,
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
// KPI CARD COMPONENT
// ============================================
const KPICard = ({ title, value, subtitle, icon: Icon, iconBg = 'bg-gray-100', iconColor = 'text-gray-600', trend, trendUp, href }) => {
  const content = (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors h-full">
      <div className="flex items-start justify-between h-full">
        <div className="flex flex-col justify-between h-full min-h-[80px]">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 tracking-tight mt-1">{value}</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">{subtitle || '\u00A0'}</p>
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
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link to={href} className="block h-full">{content}</Link>;
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
const VendorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats, recentOrders, lowStockProducts, monthlyRevenue, loading, error } = useSelector(selectVendorDashboard);

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchVendorDashboard());
  }, [dispatch]);

  // Filter orders by tab
  const filteredOrders = useMemo(() => {
    if (!recentOrders) return [];
    if (activeTab === 'all') return recentOrders.slice(0, 5);
    if (activeTab === 'active') return recentOrders.filter(o => o.status === 'active');
    if (activeTab === 'pending') return recentOrders.filter(o => o.status === 'pending');
    if (activeTab === 'completed') return recentOrders.filter(o => o.status === 'completed');
    return recentOrders;
  }, [recentOrders, activeTab]);

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
    }).format(amount || 0);
  };

  // Loading state with skeleton
  if (loading) {
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchVendorDashboard())}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
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
                Welcome back, {user?.name?.split(' ')[0] || 'Vendor'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Here's an overview of your rental business
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(fetchVendorDashboard())}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-white transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                to="/vendor/products/add"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Alert Banner - Pending Orders */}
        {stats?.pendingOrders > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800">
                  {stats.pendingOrders} order{stats.pendingOrders > 1 ? 's' : ''} awaiting confirmation
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Please review and confirm pending orders to keep customers happy.
                </p>
              </div>
              <Link
                to="/vendor/orders"
                className="text-sm font-medium text-amber-700 hover:text-amber-800 whitespace-nowrap flex-shrink-0"
              >
                Review Orders →
              </Link>
            </div>
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue)}
            subtitle="This month"
            icon={FiDollarSign}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <KPICard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            subtitle="All time orders"
            icon={FiShoppingCart}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            href="/vendor/orders"
          />
          <KPICard
            title="Active Rentals"
            value={stats?.activeRentals || 0}
            subtitle="Currently rented out"
            icon={FiClock}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />
          <KPICard
            title="Total Products"
            value={stats?.totalProducts || 0}
            subtitle={`${stats?.activeProducts || 0} active`}
            icon={FiPackage}
            iconBg="bg-gray-50"
            iconColor="text-gray-600"
            href="/vendor/products"
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

            {filteredOrders.length === 0 ? (
              <EmptyState
                icon={FiShoppingCart}
                title="No orders yet"
                description="When customers place orders, they'll appear here."
                action={{ label: 'View All Orders', href: '/vendor/orders' }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {order.orderNumber || order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {order.customer?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount || order.pricing?.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-4 py-3 border-t border-gray-100">
              <Link
                to="/vendor/orders"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
              >
                View all orders
                <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sidebar - Low Stock Products */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Low Stock Alert</h2>
              <p className="text-sm text-gray-500 mt-1">Products with low availability</p>
            </div>
            
            {!lowStockProducts || lowStockProducts.length === 0 ? (
              <div className="p-6 text-center">
                <FiCheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">All products are well stocked!</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-orange-600">
                        {product.inventory?.availableQuantity || 0} of {product.inventory?.totalQuantity || 0} available
                      </p>
                    </div>
                    <Link
                      to={`/vendor/products/${product._id}/edit`}
                      className="text-xs font-medium text-orange-700 hover:text-orange-800"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="px-4 py-3 border-t border-gray-100">
              <Link
                to="/vendor/products"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
              >
                Manage products
                <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Second Row - Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Quick Actions - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your rental business</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/vendor/products/add"
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                  <FiPlus className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Add Product</span>
              </Link>

              <Link
                to="/vendor/orders"
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <FiShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">View Orders</span>
              </Link>

              <Link
                to="/vendor/invoices"
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-3">
                  <FiFileText className="w-5 h-5 text-violet-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Invoices</span>
              </Link>

              <Link
                to="/vendor/analytics"
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                  <FiBarChart2 className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Analytics</span>
              </Link>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Performance</h3>
                  <p className="text-sm text-gray-300">This month</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
                <p className="text-sm text-gray-300">Orders</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-2xl font-bold">{stats?.activeRentals || 0}</p>
                <p className="text-sm text-gray-300">Active</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Completion Rate</span>
                <span className="font-semibold text-emerald-400">
                  {stats?.totalOrders > 0 
                    ? Math.round(((stats?.completedOrders || 0) / stats.totalOrders) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all" 
                  style={{ 
                    width: `${stats?.totalOrders > 0 
                      ? Math.round(((stats?.completedOrders || 0) / stats.totalOrders) * 100) 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
