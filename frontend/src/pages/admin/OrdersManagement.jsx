import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, getOrderStats } from '../../slices/orderSlice';
import {
  FiShoppingCart,
  FiSearch,
  FiFilter,
  FiEye,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiPackage,
  FiRefreshCw,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
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
  Area,
  AreaChart,
} from 'recharts';

// ============================================
// SKELETON LOADERS
// ============================================
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-24" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-32" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-28" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-20" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-6 w-20 rounded-full" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-16" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-8 w-20" /></td>
  </tr>
);

const ChartSkeleton = ({ className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
    <SkeletonBox className="h-5 w-32 mb-4" />
    <SkeletonBox className="h-48 w-full" />
  </div>
);

// ============================================
// STATUS CONFIGURATION
// ============================================
const statusConfig = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', color: '#f59e0b' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', color: '#3b82f6' },
  'ready-for-pickup': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', color: '#8b5cf6' },
  'picked-up': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', color: '#6366f1' },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', color: '#10b981' },
  returned: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', color: '#6b7280' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', color: '#22c55e' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', color: '#ef4444' },
  overdue: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', color: '#dc2626' },
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
// ORDER DETAIL MODAL
// ============================================
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
              <p className="text-sm text-gray-500">{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Status & Date */}
            <div className="flex items-center justify-between">
              <StatusBadge status={order.status} />
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* Customer & Vendor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiUser className="w-4 h-4" />
                  <span className="text-sm font-medium">Customer</span>
                </div>
                <p className="font-semibold text-gray-900">{order.customer?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{order.customer?.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiPackage className="w-4 h-4" />
                  <span className="text-sm font-medium">Vendor</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {order.vendor?.vendorInfo?.businessName || order.vendor?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">{order.vendor?.email}</p>
              </div>
            </div>

            {/* Rental Period */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <FiCalendar className="w-4 h-4" />
                <span className="text-sm font-medium">Rental Period</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-blue-600">Start Date</p>
                  <p className="font-medium text-blue-900">
                    {new Date(order.rentalPeriod?.startDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-blue-400">→</span>
                <div>
                  <p className="text-xs text-blue-600">End Date</p>
                  <p className="font-medium text-blue-900">
                    {new Date(order.rentalPeriod?.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <p className="text-xs text-blue-600">Duration</p>
                  <p className="font-medium text-blue-900">{order.rentalPeriod?.duration} days</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {order.items?.map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 ${idx > 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.product?.name || 'Product'}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.pricePerDay}/day</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.totalPrice?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{order.pricing?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{order.pricing?.tax?.toFixed(2)}</span>
                </div>
                {order.pricing?.securityDeposit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="text-gray-900">₹{order.pricing?.securityDeposit?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-indigo-600">₹{order.pricing?.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const OrdersManagement = () => {
  const dispatch = useDispatch();
  const { orders, pagination, isLoading, stats } = useSelector((state) => state.orders);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders
  const fetchOrders = (page = 1) => {
    const params = { page, limit: 20 };
    if (statusFilter) params.status = statusFilter;
    dispatch(getAllOrders(params));
    dispatch(getOrderStats());
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

  // Filter orders by search term (client-side)
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter(order => 
      order.orderNumber?.toLowerCase().includes(term) ||
      order.customer?.name?.toLowerCase().includes(term) ||
      order.customer?.email?.toLowerCase().includes(term) ||
      order.vendor?.name?.toLowerCase().includes(term) ||
      order.vendor?.vendorInfo?.businessName?.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  // Calculate stats from orders
  const orderStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const activeOrders = orders.filter(o => o.status === 'active').length;
    const pendingOrders = orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;
    
    // Group by status for pie chart
    const statusCounts = {};
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      color: statusConfig[status]?.color || '#6b7280'
    }));

    // Group by date for line chart (last 7 days)
    const dateMap = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      dateMap[key] = { date: date.toLocaleDateString('en-US', { weekday: 'short' }), orders: 0, revenue: 0 };
    }
    orders.forEach(o => {
      const key = new Date(o.createdAt).toISOString().split('T')[0];
      if (dateMap[key]) {
        dateMap[key].orders += 1;
        dateMap[key].revenue += o.pricing?.total || 0;
      }
    });
    const dailyData = Object.values(dateMap);

    return { totalRevenue, completedOrders, activeOrders, pendingOrders, statusData, dailyData };
  }, [orders]);

  // Download CSV
  const downloadCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Customer Email', 'Vendor', 'Status', 'Duration (Days)', 'Subtotal', 'Tax', 'Total'];
    const rows = filteredOrders.map(order => [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString(),
      order.customer?.name || 'N/A',
      order.customer?.email || 'N/A',
      order.vendor?.vendorInfo?.businessName || order.vendor?.name || 'N/A',
      order.status,
      order.rentalPeriod?.duration || 0,
      order.pricing?.subtotal?.toFixed(2) || '0.00',
      order.pricing?.tax?.toFixed(2) || '0.00',
      order.pricing?.total?.toFixed(2) || '0.00'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Download JSON
  const downloadJSON = () => {
    const data = filteredOrders.map(order => ({
      orderNumber: order.orderNumber,
      date: order.createdAt,
      customer: {
        name: order.customer?.name,
        email: order.customer?.email
      },
      vendor: {
        name: order.vendor?.vendorInfo?.businessName || order.vendor?.name,
        email: order.vendor?.email
      },
      status: order.status,
      rentalPeriod: order.rentalPeriod,
      pricing: order.pricing,
      items: order.items?.map(item => ({
        product: item.product?.name,
        quantity: item.quantity,
        pricePerDay: item.pricePerDay,
        total: item.totalPrice
      }))
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">View all transactions and order details</p>
        </div>
        <button
          onClick={() => fetchOrders(currentPage)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pagination?.total || orders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FiShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{orderStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Rentals</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.activeOrders}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.pendingOrders}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <FiClock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Orders Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Orders & Revenue (Last 7 Days)</h3>
          {isLoading ? (
            <SkeletonBox className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={orderStats.dailyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${value.toFixed(2)}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Bar yAxisId="left" dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Status Distribution</h3>
          {isLoading ? (
            <SkeletonBox className="h-48 w-full" />
          ) : orderStats.statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderStats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {orderStats.statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                  formatter={(value) => <span className="text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search & Download */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="picked-up">Picked Up</option>
            <option value="active">Active</option>
            <option value="returned">Returned</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Download Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={downloadJSON}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    <FiShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No orders found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.items?.length || 0} item(s)</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.customer?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.customer?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {order.vendor?.vendorInfo?.businessName || order.vendor?.name || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">{order.rentalPeriod?.duration || 0} days</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="font-semibold text-gray-900">₹{order.pricing?.total?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-gray-500">
                        {order.paymentStatus === 'paid' ? (
                          <span className="text-green-600">Paid</span>
                        ) : (
                          <span className="text-amber-600">Pending</span>
                        )}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && filteredOrders.length > 0 && pagination?.pages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * 20, pagination.total)}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchOrders(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchOrders(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersManagement;
