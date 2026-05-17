import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  FiPackage,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiDollarSign,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiBox,
  FiStar,
  FiRefreshCw,
  FiGrid,
  FiList,
} from 'react-icons/fi';

// ============================================
// SKELETON LOADERS
// ============================================
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <SkeletonBox className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonBox className="h-5 w-3/4" />
      <SkeletonBox className="h-4 w-1/2" />
      <SkeletonBox className="h-4 w-full" />
      <div className="flex justify-between pt-2">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-6 w-16" />
      </div>
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-4"><SkeletonBox className="h-12 w-12 rounded-lg" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-32" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-24" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-20" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-16" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-6 w-16 rounded-full" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-8 w-24" /></td>
  </tr>
);

// ============================================
// STATUS & CONDITION BADGES
// ============================================
const conditionConfig = {
  new: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'New' },
  'like-new': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Like New' },
  good: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Good' },
  fair: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Fair' },
};

const ConditionBadge = ({ condition }) => {
  const config = conditionConfig[condition] || conditionConfig.good;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

const StatusBadge = ({ isActive }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
    isActive 
      ? 'bg-green-50 text-green-700 border-green-200' 
      : 'bg-red-50 text-red-700 border-red-200'
  }`}>
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

// ============================================
// CATEGORY CONFIG
// ============================================
const categoryConfig = {
  electronics: { label: 'Electronics', color: 'bg-blue-100 text-blue-700' },
  furniture: { label: 'Furniture', color: 'bg-amber-100 text-amber-700' },
  vehicles: { label: 'Vehicles', color: 'bg-red-100 text-red-700' },
  tools: { label: 'Tools', color: 'bg-gray-100 text-gray-700' },
  sports: { label: 'Sports', color: 'bg-green-100 text-green-700' },
  party: { label: 'Party', color: 'bg-pink-100 text-pink-700' },
  clothing: { label: 'Clothing', color: 'bg-purple-100 text-purple-700' },
  cameras: { label: 'Cameras', color: 'bg-indigo-100 text-indigo-700' },
  audio: { label: 'Audio', color: 'bg-cyan-100 text-cyan-700' },
  outdoor: { label: 'Outdoor', color: 'bg-emerald-100 text-emerald-700' },
  transport: { label: 'Transport', color: 'bg-orange-100 text-orange-700' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700' },
};

const CategoryBadge = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig.other;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// ============================================
// PRODUCT DETAIL MODAL
// ============================================
const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-3xl p-6 my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CategoryBadge category={product.category} />
                  <ConditionBadge condition={product.condition} />
                  <StatusBadge isActive={product.isActive} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
              </div>

              {/* Vendor Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.vendor?.vendorInfo?.businessName || product.vendor?.name || 'Unknown Vendor'}
                    </p>
                    <p className="text-xs text-gray-500">{product.vendor?.email}</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4" /> Pricing
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-gray-900">₹{product.pricing?.daily || 0}</p>
                    <p className="text-xs text-gray-500">Per Day</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-gray-900">₹{product.pricing?.weekly || 0}</p>
                    <p className="text-xs text-gray-500">Per Week</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-gray-900">₹{product.pricing?.monthly || 0}</p>
                    <p className="text-xs text-gray-500">Per Month</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-gray-900">₹{product.pricing?.securityDeposit || 0}</p>
                    <p className="text-xs text-gray-500">Deposit</p>
                  </div>
                </div>
              </div>

              {/* Inventory & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <FiBox className="w-4 h-4" />
                    <span className="text-sm font-medium">Inventory</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {product.inventory?.availableQuantity || 0} / {product.inventory?.totalQuantity || 0}
                  </p>
                  <p className="text-xs text-gray-500">Available / Total</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.location?.city || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">{product.location?.state}</p>
                </div>
              </div>

              {/* Ratings */}
              {product.ratings?.count > 0 && (
                <div className="flex items-center gap-2">
                  <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-gray-900">{product.ratings.average.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({product.ratings.count} reviews)</span>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                Created: {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const ProductsManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // View mode
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: pagination.limit,
      };
      
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (conditionFilter) params.condition = conditionFilter;

      const response = await axios.get('/api/products', { params });
      
      let filteredProducts = response.data.data || [];
      
      // Client-side status filter (since API returns all products)
      if (statusFilter === 'active') {
        filteredProducts = filteredProducts.filter(p => p.isActive);
      } else if (statusFilter === 'inactive') {
        filteredProducts = filteredProducts.filter(p => !p.isActive);
      }

      setProducts(filteredProducts);
      setPagination({
        ...pagination,
        page,
        total: response.data.pagination?.total || filteredProducts.length,
        pages: response.data.pagination?.pages || Math.ceil(filteredProducts.length / pagination.limit),
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, conditionFilter, statusFilter]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">View and manage all products across vendors</p>
        </div>
        <button
          onClick={() => fetchProducts(pagination.page)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              <p className="text-sm text-gray-500">Total Products</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Active Products</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              <p className="text-sm text-gray-500">Inactive Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                showFilters 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiFilter className="w-4 h-4" />
              Filters
            </button>

            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {Object.entries(categoryConfig).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Conditions</option>
                {Object.entries(conditionConfig).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Products Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price/Day</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Condition</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-gray-500">
                      <FiPackage className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">No products found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={product.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.location?.city || 'No location'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {product.vendor?.vendorInfo?.businessName || product.vendor?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">{product.vendor?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <CategoryBadge category={product.category} />
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">₹{product.pricing?.daily || 0}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-sm font-medium ${
                          product.inventory?.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.inventory?.availableQuantity || 0} / {product.inventory?.totalQuantity || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <ConditionBadge condition={product.condition} />
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge isActive={product.isActive} />
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedProduct(product)}
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
      )}

      {/* Products Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : products.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              <FiPackage className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <StatusBadge isActive={product.isActive} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryBadge category={product.category} />
                    <ConditionBadge condition={product.condition} />
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    by {product.vendor?.vendorInfo?.businessName || product.vendor?.name || 'Unknown Vendor'}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-lg font-bold text-gray-900">₹{product.pricing?.daily || 0}</span>
                      <span className="text-sm text-gray-500">/day</span>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchProducts(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchProducts(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsManagement;
