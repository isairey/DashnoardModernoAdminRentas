import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorOrders, updateOrderStatus } from '../../slices/orderSlice';
import { toast } from 'react-toastify';
import {
  FiPackage,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMapPin,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiCheck,
  FiX,
  FiClock,
  FiTruck,
  FiRefreshCw,
  FiEye,
} from 'react-icons/fi';

// ============================================
// SKELETON LOADERS
// ============================================
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-4">
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-3 w-20" />
      </div>
    </td>
    <td className="py-4 px-4">
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-32" />
        <SkeletonBox className="h-3 w-40" />
      </div>
    </td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-16" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-24" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-20" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-6 w-24 rounded-full" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-8 w-20" /></td>
  </tr>
);

// ============================================
// STATUS CONFIG
// ============================================
const statusConfig = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending', icon: FiClock },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Confirmed', icon: FiCheck },
  'ready-for-pickup': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', label: 'Ready for Pickup', icon: FiPackage },
  'picked-up': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Picked Up', icon: FiTruck },
  returned: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Returned', icon: FiCheck },
  completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Completed', icon: FiCheck },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Cancelled', icon: FiX },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const VendorOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getVendorOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !search ||
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success('Order status updated');
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error?.message || 'Failed to update status');
    }
  };

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

  const getNextStatus = (currentStatus) => {
    const flow = {
      pending: 'confirmed',
      confirmed: 'ready-for-pickup',
      'ready-for-pickup': 'picked-up',
      'picked-up': 'returned',
      returned: 'completed',
    };
    return flow[currentStatus];
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => ['confirmed', 'ready-for-pickup', 'picked-up'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your rental orders</p>
            </div>
            <button
              onClick={() => dispatch(getVendorOrders())}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-white transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-semibold text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-semibold text-blue-600 mt-1">{stats.active}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-semibold text-emerald-600 mt-1">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders by ID or customer..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white min-w-[160px]"
            >
              <option value="">All Status</option>
              {Object.entries(statusConfig).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Order</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Customer</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Items</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Period</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Total</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
              </tbody>
            </table>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Order</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Customer</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Items</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4 hidden md:table-cell">Period</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Total</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link to={`/vendor/orders/${order._id}`} className="block hover:text-blue-600">
                          <p className="text-sm font-medium text-gray-900 hover:text-blue-600">
                            #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer?.email}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {order.items?.slice(0, 2).map((item, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 bg-gray-100 rounded-lg border-2 border-white overflow-hidden"
                              >
                                {item.product?.images?.[0] ? (
                                  <img
                                    src={item.product.images[0]}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FiPackage className="w-3 h-3 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <p className="text-sm text-gray-900">
                          {formatDate(order.rentalPeriod?.startDate)}
                        </p>
                        <p className="text-xs text-gray-500">
                          to {formatDate(order.rentalPeriod?.endDate)}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.pricing?.total || 0)}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg py-16">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <FiPackage className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 text-center max-w-sm">
                {search || statusFilter
                  ? 'Try adjusting your search or filter criteria'
                  : 'Orders will appear here when customers place them'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
