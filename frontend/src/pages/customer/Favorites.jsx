import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiGrid,
  FiList,
  FiSearch,
  FiStar,
} from 'react-icons/fi';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state) => state.auth);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem(`favorites_${user?.id || 'guest'}`);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, [user]);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites) => {
    localStorage.setItem(`favorites_${user?.id || 'guest'}`, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  // Remove from favorites
  const removeFromFavorites = (productId) => {
    const newFavorites = favorites.filter(item => item._id !== productId);
    saveFavorites(newFavorites);
    toast.success('Removed from favorites');
  };

  // Add to cart
  const addToCart = (product) => {
    const cartKey = `cart_${user?.id || 'guest'}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    const existingItem = existingCart.find(item => item._id === product._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    toast.success('Added to cart!');
  };

  // Filter favorites by search
  const filteredFavorites = favorites.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-sm text-gray-500 mt-1">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg 
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Content */}
      {filteredFavorites.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHeart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No favorites found' : 'No favorites yet'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery 
              ? 'Try a different search term'
              : 'Start adding products to your favorites to see them here'
            }
          </p>
          <Link
            to="/customer/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFavorites.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={product.images?.[0] || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
                <button
                  onClick={() => removeFromFavorites(product._id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FiHeart className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link 
                  to={`/customer/products/${product._id}`}
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 line-clamp-2"
                >
                  {product.name}
                </Link>
                
                {product.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                )}

                <div className="mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.pricing?.daily || product.price)}
                  </span>
                  <span className="text-xs text-gray-500">/day</span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromFavorites(product._id)}
                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredFavorites.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.images?.[0] || '/placeholder-product.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/customer/products/${product._id}`}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {product.description}
                  </p>
                  {product.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">{product.rating}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.pricing?.daily || product.price)}
                  </span>
                  <span className="text-xs text-gray-500">/day</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromFavorites(product._id)}
                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
