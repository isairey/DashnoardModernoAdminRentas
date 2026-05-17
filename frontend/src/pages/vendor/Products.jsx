import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getVendorProducts, deleteProduct, selectVendorProducts } from '../../slices/productSlice';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiPackage, FiRefreshCw, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';

// ============================================
// SKELETON LOADERS
// ============================================
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <SkeletonBox className="aspect-video w-full" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-5 w-16 rounded-full" />
      </div>
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-2/3" />
      <div className="flex justify-between pt-2">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-4 w-20" />
      </div>
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <SkeletonBox className="h-9 flex-1" />
        <SkeletonBox className="h-9 flex-1" />
        <SkeletonBox className="h-9 w-9" />
      </div>
    </div>
  </div>
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

const VendorProducts = () => {
  const dispatch = useDispatch();
  // Use products from API
  const products = useSelector(selectVendorProducts);
  const { isLoading } = useSelector((state) => state.products);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch products on mount
  useEffect(() => {
    dispatch(getVendorProducts());
  }, [dispatch]);

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId))
        .unwrap()
        .then(() => {
          toast.success('Product deleted successfully');
        })
        .catch((error) => {
          toast.error(error || 'Failed to delete product');
        });
    }
  };

  const handleRefresh = () => {
    dispatch(getVendorProducts());
  };

  // Helper to check if product is active (handles both API and local formats)
  const isProductActive = (product) => product.isActive ?? product.availability ?? true;
  
  // Helper to get total quantity (handles both API and local formats)
  const getQuantity = (product) => product.inventory?.totalQuantity ?? product.totalQuantity ?? 0;

  // Filter products based on search and status
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase());
    const active = isProductActive(product);
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && active) ||
      (statusFilter === 'inactive' && !active);
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate stats
  const stats = {
    total: (products || []).length,
    active: (products || []).filter(p => isProductActive(p)).length,
    inactive: (products || []).filter(p => !isProductActive(p)).length,
    outOfStock: (products || []).filter(p => getQuantity(p) === 0).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Products</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your rental products</p>
            </div>
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-semibold text-emerald-600 mt-1">{stats.active}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Inactive</p>
            <p className="text-2xl font-semibold text-gray-600 mt-1">{stats.inactive}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-semibold text-red-600 mt-1">{stats.outOfStock}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProducts.map((product) => (
              viewMode === 'grid' ? (
                <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 overflow-hidden relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-50">
                        <FiPackage className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <StatusBadge isActive={isProductActive(product)} />
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between text-sm pt-2">
                      <span className="text-gray-500">
                        <span className={`font-medium ${getQuantity(product) === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {getQuantity(product)}
                        </span>
                        &nbsp;available
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(product.pricing?.daily)}<span className="text-gray-400 font-normal">/day</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Link
                        to={`/vendor/products/${product._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        View
                      </Link>
                      <Link
                        to={`/vendor/products/${product._id}/edit`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiPackage className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                        <StatusBadge isActive={isProductActive(product)} />
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1 mb-2">{product.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          <span className="font-medium text-gray-900">{getQuantity(product)}</span> available
                        </span>
                        <span className="font-semibold text-gray-900">{formatCurrency(product.pricing?.daily)}/day</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/vendor/products/${product._id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FiEye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/vendor/products/${product._id}/edit`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg py-16">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <FiPackage className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6 text-center max-w-sm">Start by adding your first rental product to start receiving orders</p>
              <Link
                to="/vendor/products/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Your First Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProducts;
