import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../../services/auth.service';
import { FiSearch, FiFilter, FiCheck, FiX, FiMoreVertical, FiRefreshCw, FiUsers, FiUserPlus, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';

// ============================================
// SKELETON LOADERS
// ============================================
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <SkeletonBox className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-3 w-40" />
        </div>
      </div>
    </td>
    <td className="py-4 px-4"><SkeletonBox className="h-6 w-20 rounded-full" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-6 w-16 rounded-full" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-24" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-8 w-16" /></td>
  </tr>
);

// ============================================
// STATUS BADGE
// ============================================
const StatusBadge = ({ isActive }) => {
  return isActive ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border bg-red-50 text-red-700 border-red-200">
      Inactive
    </span>
  );
};

// ============================================
// ROLE BADGE
// ============================================
const RoleBadge = ({ role }) => {
  const config = {
    admin: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    vendor: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    customer: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  };
  const styles = config[role] || config.customer;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border capitalize ${styles.bg} ${styles.text} ${styles.border}`}>
      {role}
    </span>
  );
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const { token } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (roleFilter) params.role = roleFilter;

      const response = await authService.getAllUsers(params, token);
      setUsers(response.data);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error) {
      toast.error('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter]);

  const handleStatusChange = async (userId, isActive) => {
    try {
      await authService.updateUserStatus(userId, isActive, token);
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      await authService.approveVendor(vendorId, token);
      toast.success('Vendor approved successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to approve vendor');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    vendors: users.filter(u => u.role === 'vendor').length,
    customers: users.filter(u => u.role === 'customer').length,
    pendingVendors: users.filter(u => u.role === 'vendor' && !u.vendorInfo?.isApproved).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage all platform users and vendors</p>
            </div>
            <button
              onClick={fetchUsers}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vendors</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.vendors}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FiUserPlus className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.customers}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.pendingVendors}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <FiShield className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white min-w-[140px]"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">User</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Role</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Joined</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-600">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <RoleBadge role={user.role} />
                          {user.role === 'vendor' && !user.vendorInfo?.isApproved && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge isActive={user.isActive} />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          {user.role === 'vendor' && !user.vendorInfo?.isApproved && (
                            <button
                              onClick={() => handleApproveVendor(user._id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve Vendor"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusChange(user._id, !user.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive ? (
                              <FiX className="w-4 h-4" />
                            ) : (
                              <FiCheck className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                          <FiUsers className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">No users found</p>
                        <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100 bg-gray-50/30">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
