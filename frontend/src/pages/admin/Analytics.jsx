import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiRefreshCw,
  FiCalendar,
  FiPieChart,
  FiBarChart2,
  FiActivity,
  FiTarget,
  FiAward,
  FiMapPin,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiDownload,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from 'recharts';

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
        <SkeletonBox className="h-8 w-20" />
        <SkeletonBox className="h-3 w-32" />
      </div>
      <SkeletonBox className="h-10 w-10 rounded-lg" />
    </div>
  </div>
);

const ChartSkeleton = ({ height = 'h-64' }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5">
    <SkeletonBox className="h-5 w-40 mb-4" />
    <SkeletonBox className={`w-full ${height}`} />
  </div>
);

// ============================================
// COLORS
// ============================================
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];
const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  'picked-up': '#6366f1',
  active: '#10b981',
  returned: '#6b7280',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

// ============================================
// CUSTOM TOOLTIP
// ============================================
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================
// KPI CARD
// ============================================
const KPICard = ({ title, value, icon: Icon, change, changeType, subtitle, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {changeType === 'up' ? (
                <FiArrowUp className="w-4 h-4 text-green-500" />
              ) : changeType === 'down' ? (
                <FiArrowDown className="w-4 h-4 text-red-500" />
              ) : null}
              <span className={`text-sm font-medium ${changeType === 'up' ? 'text-green-600' : changeType === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                {change}
              </span>
              {subtitle && <span className="text-sm text-gray-400 ml-1">{subtitle}</span>}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const Analytics = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [timeRange, setTimeRange] = useState('6months');

  // Fetch all analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch admin dashboard data
      const [dashboardRes, ordersRes, productsRes] = await Promise.all([
        axios.get('/api/dashboard/admin', config),
        axios.get('/api/orders', { ...config, params: { limit: 100 } }),
        axios.get('/api/products', { params: { limit: 100 } }),
      ]);

      setDashboardData(dashboardRes.data.data);
      setOrdersData(ordersRes.data.data || []);
      setProductsData(productsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Process monthly stats for chart
  const monthlyChartData = useMemo(() => {
    if (!dashboardData?.monthlyStats) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return dashboardData.monthlyStats.map(item => ({
      name: `${months[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue || 0,
      orders: item.orders || 0,
    }));
  }, [dashboardData]);

  // Process order status distribution
  const orderStatusData = useMemo(() => {
    const statusCounts = {};
    ordersData.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      color: STATUS_COLORS[status] || '#6b7280',
    }));
  }, [ordersData]);

  // Process category distribution
  const categoryData = useMemo(() => {
    const categoryCounts = {};
    productsData.forEach(product => {
      const cat = product.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    return Object.entries(categoryCounts)
      .map(([category, count], index) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: count,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [productsData]);

  // Process revenue by category
  const revenueByCategory = useMemo(() => {
    const categoryRevenue = {};
    ordersData.forEach(order => {
      order.items?.forEach(item => {
        const cat = item.product?.category || 'Other';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.totalPrice || 0);
      });
    });
    return Object.entries(categoryRevenue)
      .map(([category, revenue]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        revenue: revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [ordersData]);

  // Process daily orders for the last 30 days
  const dailyOrdersData = useMemo(() => {
    const dateMap = {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      dateMap[key] = { 
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        orders: 0, 
        revenue: 0 
      };
    }
    ordersData.forEach(order => {
      const key = new Date(order.createdAt).toISOString().split('T')[0];
      if (dateMap[key]) {
        dateMap[key].orders += 1;
        dateMap[key].revenue += order.pricing?.total || 0;
      }
    });
    return Object.values(dateMap);
  }, [ordersData]);

  // Calculate growth metrics
  const growthMetrics = useMemo(() => {
    if (!dashboardData) return {};
    
    const thisMonth = monthlyChartData[monthlyChartData.length - 1] || { revenue: 0, orders: 0 };
    const lastMonth = monthlyChartData[monthlyChartData.length - 2] || { revenue: 0, orders: 0 };
    
    const revenueGrowth = lastMonth.revenue > 0 
      ? (((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100).toFixed(1)
      : 0;
    const orderGrowth = lastMonth.orders > 0 
      ? (((thisMonth.orders - lastMonth.orders) / lastMonth.orders) * 100).toFixed(1)
      : 0;

    return { revenueGrowth, orderGrowth };
  }, [monthlyChartData, dashboardData]);

  // Top products by orders
  const topProducts = useMemo(() => {
    const productOrders = {};
    ordersData.forEach(order => {
      order.items?.forEach(item => {
        const name = item.product?.name || 'Unknown';
        if (!productOrders[name]) {
          productOrders[name] = { name, orders: 0, revenue: 0 };
        }
        productOrders[name].orders += item.quantity || 1;
        productOrders[name].revenue += item.totalPrice || 0;
      });
    });
    return Object.values(productOrders)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);
  }, [ordersData]);

  // Average order value
  const avgOrderValue = useMemo(() => {
    if (ordersData.length === 0) return 0;
    const total = ordersData.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    return total / ordersData.length;
  }, [ordersData]);

  // Conversion and performance metrics
  const performanceMetrics = useMemo(() => {
    const activeProducts = productsData.filter(p => p.isActive).length;
    const utilizationRate = productsData.length > 0 
      ? ((productsData.filter(p => p.inventory?.availableQuantity < p.inventory?.totalQuantity).length / productsData.length) * 100).toFixed(1)
      : 0;
    
    const completedOrders = ordersData.filter(o => o.status === 'completed').length;
    const completionRate = ordersData.length > 0 
      ? ((completedOrders / ordersData.length) * 100).toFixed(1)
      : 0;

    return { utilizationRate, completionRate, activeProducts };
  }, [productsData, ordersData]);

  // Export report
  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue: dashboardData?.stats?.totalRevenue || 0,
        totalOrders: dashboardData?.stats?.totalOrders || 0,
        totalUsers: dashboardData?.stats?.totalUsers || 0,
        totalProducts: dashboardData?.stats?.totalProducts || 0,
        avgOrderValue: avgOrderValue,
      },
      monthlyStats: monthlyChartData,
      topVendors: dashboardData?.topVendors || [],
      topProducts: topProducts,
      orderStatusDistribution: orderStatusData,
      categoryDistribution: categoryData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-8 w-48" />
          <SkeletonBox className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={FiDollarSign}
          change={`${growthMetrics.revenueGrowth}%`}
          changeType={parseFloat(growthMetrics.revenueGrowth) >= 0 ? 'up' : 'down'}
          subtitle="vs last month"
          color="green"
        />
        <KPICard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon={FiShoppingCart}
          change={`${growthMetrics.orderGrowth}%`}
          changeType={parseFloat(growthMetrics.orderGrowth) >= 0 ? 'up' : 'down'}
          subtitle="vs last month"
          color="indigo"
        />
        <KPICard
          title="Avg Order Value"
          value={`₹${avgOrderValue.toFixed(2)}`}
          icon={FiTarget}
          color="purple"
        />
        <KPICard
          title="Active Rentals"
          value={stats.activeRentals || 0}
          icon={FiActivity}
          color="amber"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={FiUsers}
          subtitle={`${stats.totalCustomers || 0} customers, ${stats.totalVendors || 0} vendors`}
          color="blue"
        />
        <KPICard
          title="Total Products"
          value={stats.totalProducts || 0}
          icon={FiPackage}
          subtitle={`${performanceMetrics.activeProducts} active`}
          color="green"
        />
        <KPICard
          title="Utilization Rate"
          value={`${performanceMetrics.utilizationRate}%`}
          icon={FiPieChart}
          color="purple"
        />
        <KPICard
          title="Completion Rate"
          value={`${performanceMetrics.completionRate}%`}
          icon={FiAward}
          color="green"
        />
      </div>

      {/* Revenue & Orders Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue & Orders */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4 text-indigo-500" />
            Monthly Revenue & Orders
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip 
                content={<CustomTooltip formatter={(val, name) => name === 'Revenue' ? `$${val.toLocaleString()}` : val} />}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Orders Trend (Last 30 days) */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-indigo-500" />
            Daily Orders (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyOrdersData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" interval={4} />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="orders" stroke="#6366f1" fill="url(#colorOrders)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiPieChart className="w-4 h-4 text-indigo-500" />
            Order Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiBarChart2 className="w-4 h-4 text-indigo-500" />
            Products by Category
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
              <Tooltip />
              <Bar dataKey="value" name="Products" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiDollarSign className="w-4 h-4 text-indigo-500" />
            Revenue by Category
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(val) => `$${val}`} />
              <Tooltip formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiAward className="w-4 h-4 text-amber-500" />
            Top Performing Vendors
          </h3>
          <div className="space-y-3">
            {(dashboardData?.topVendors || []).length > 0 ? (
              dashboardData.topVendors.map((vendor, index) => (
                <div key={vendor._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendor.businessName || vendor.name}</p>
                      <p className="text-xs text-gray-500">{vendor.orderCount} orders</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">${vendor.totalRevenue?.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No vendor data available</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiPackage className="w-4 h-4 text-indigo-500" />
            Top Rented Products
          </h3>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-indigo-400' : index === 2 ? 'bg-indigo-300' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.orders} rentals</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">${product.revenue?.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No product data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FiClock className="w-4 h-4 text-indigo-500" />
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(dashboardData?.recentOrders || []).slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{order.customer?.name || 'N/A'}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{order.vendor?.name || 'N/A'}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium`} style={{ backgroundColor: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status] }}>
                      {order.status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <p className="font-semibold text-gray-900">₹{order.pricing?.total?.toFixed(2) || '0.00'}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
