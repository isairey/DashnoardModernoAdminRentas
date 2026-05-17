import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';

const API_URL = '/api';

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, color, prefix = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    pink: 'bg-pink-50 text-pink-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />}
              <span>{change}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Chart Bar Component (Simple CSS bar chart)
const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-16">{item.label}</span>
            <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-lg transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-24 text-right">
              ₹{item.value.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Chart (horizontal bars)
const OrdersChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-16">{item.label}</span>
            <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-16 text-right">
              {item.value} orders
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component (CSS)
const DonutChart = ({ data, title, total }) => {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  let cumulativePercent = 0;
  
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
            {data.map((item, index) => {
              const percent = total > 0 ? item.value / total : 0;
              const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
              cumulativePercent += percent;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              const largeArcFlag = percent > 0.5 ? 1 : 0;
              const pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`,
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{total}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Top Products Table
const TopProductsTable = ({ products }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No product data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Product</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Orders</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right text-sm text-gray-600">{product.orders}</td>
                  <td className="py-3 px-2 text-right text-sm font-medium text-gray-900">
                    ₹{product.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Recent Transactions
const RecentTransactions = ({ orders }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent transactions</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FiShoppingCart className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customer?.name || 'Customer'}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ₹{(order.pricing?.total || 0).toLocaleString('en-IN')}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  order.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VendorAnalytics = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState('6months');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/dashboard/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  // Process monthly revenue data for chart
  const getRevenueChartData = () => {
    if (!dashboardData?.monthlyRevenue) return [];
    return dashboardData.monthlyRevenue.map(item => ({
      label: getMonthName(item._id.month),
      value: item.revenue || 0,
    }));
  };

  // Process monthly orders data for chart
  const getOrdersChartData = () => {
    if (!dashboardData?.monthlyRevenue) return [];
    return dashboardData.monthlyRevenue.map(item => ({
      label: getMonthName(item._id.month),
      value: item.orders || 0,
    }));
  };

  // Get order status distribution
  const getOrderStatusData = () => {
    if (!dashboardData?.stats) return [];
    const { pendingOrders, activeRentals, completedOrders, totalOrders } = dashboardData.stats;
    const other = totalOrders - (pendingOrders + activeRentals + completedOrders);
    return [
      { label: 'Completed', value: completedOrders || 0 },
      { label: 'Active', value: activeRentals || 0 },
      { label: 'Pending', value: pendingOrders || 0 },
      ...(other > 0 ? [{ label: 'Other', value: other }] : []),
    ].filter(item => item.value > 0);
  };

  // Get top products from recent orders
  const getTopProducts = () => {
    if (!dashboardData?.recentOrders) return [];
    const productMap = new Map();
    
    dashboardData.recentOrders.forEach(order => {
      order.items?.forEach(item => {
        const name = item.product?.name || 'Unknown Product';
        const existing = productMap.get(name) || { name, orders: 0, revenue: 0 };
        existing.orders += 1;
        existing.revenue += item.totalPrice || 0;
        productMap.set(name, existing);
      });
    });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Calculate change percentage (mock for now, can be enhanced with historical data)
  const calculateChange = (current) => {
    // This would need historical data comparison
    return Math.floor(Math.random() * 20) + 1;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="6months">Last 6 Months</option>
            <option value="3months">Last 3 Months</option>
            <option value="1month">Last Month</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue || 0}
          prefix="₹"
          change={calculateChange(stats.totalRevenue)}
          changeType="increase"
          icon={FiDollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          change={calculateChange(stats.totalOrders)}
          changeType="increase"
          icon={FiShoppingCart}
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts || 0}
          icon={FiPackage}
          color="purple"
        />
        <StatCard
          title="Active Rentals"
          value={stats.activeRentals || 0}
          icon={FiActivity}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={getRevenueChartData()}
          title="Monthly Revenue"
        />
        <OrdersChart
          data={getOrdersChartData()}
          title="Monthly Orders"
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DonutChart
          data={getOrderStatusData()}
          title="Order Status Distribution"
          total={stats.totalOrders || 0}
        />
        <div className="lg:col-span-2">
          <TopProductsTable products={getTopProducts()} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions orders={dashboardData?.recentOrders || []} />
        
        {/* Performance Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed Orders</p>
                  <p className="text-xs text-gray-500">Successfully fulfilled</p>
                </div>
              </div>
              <span className="text-xl font-bold text-green-600">{stats.completedOrders || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FiActivity className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Pending Orders</p>
                  <p className="text-xs text-gray-500">Awaiting processing</p>
                </div>
              </div>
              <span className="text-xl font-bold text-yellow-600">{stats.pendingOrders || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiPackage className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Products</p>
                  <p className="text-xs text-gray-500">In your inventory</p>
                </div>
              </div>
              <span className="text-xl font-bold text-blue-600">{stats.totalProducts || 0}</span>
            </div>

            {dashboardData?.lowStockProducts?.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FiTrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Low Stock Alert</p>
                    <p className="text-xs text-gray-500">Products need restocking</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-red-600">{dashboardData.lowStockProducts.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;
