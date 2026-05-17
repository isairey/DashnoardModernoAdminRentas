import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../../slices/productSlice';
import { addToCart } from '../../slices/cartSlice';
import { toast } from 'react-toastify';
import {
  FiMapPin,
  FiStar,
  FiPackage,
  FiCalendar,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiInfo,
  FiUser,
  FiShield,
} from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const calculateDays = () => {
    if (!rentalDates.startDate || !rentalDates.endDate) return 0;
    const start = new Date(rentalDates.startDate);
    const end = new Date(rentalDates.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const calculatePrice = () => {
    const days = calculateDays();
    if (!days || !product?.pricing) return 0;

    let rate = product.pricing.daily;
    if (days >= 30 && product.pricing.monthly) {
      rate = product.pricing.monthly / 30;
    } else if (days >= 7 && product.pricing.weekly) {
      rate = product.pricing.weekly / 7;
    }

    return (rate * days * quantity).toFixed(2);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!rentalDates.startDate || !rentalDates.endDate) {
      toast.error('Please select rental dates');
      return;
    }

    const days = calculateDays();
    if (days < 1) {
      toast.error('End date must be after start date');
      return;
    }

    dispatch(
      addToCart({
        product,
        startDate: rentalDates.startDate,
        endDate: rentalDates.endDate,
        quantity,
        days,
        totalPrice: parseFloat(calculatePrice()),
      })
    );
    toast.success('Added to cart!');
  };

  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary mt-4">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/products')} className="hover:text-blue-600">
          Products
        </button>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
            {product.images?.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-50">
                <FiPackage className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    idx === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-primary">{product.category}</span>
            <span className="badge">{product.condition}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-medium">
                {product.ratings?.average?.toFixed(1) || 'New'}
              </span>
              {product.ratings?.count > 0 && (
                <span className="text-gray-500">({product.ratings.count} reviews)</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <FiMapPin className="w-4 h-4" />
              <span>{product.location?.city || 'Location N/A'}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Pricing */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Rental Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">${product.pricing?.daily}</p>
                <p className="text-sm text-gray-500">per day</p>
              </div>
              {product.pricing?.weekly && (
                <div className="text-center border-l border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">${product.pricing.weekly}</p>
                  <p className="text-sm text-gray-500">per week</p>
                </div>
              )}
              {product.pricing?.monthly && (
                <div className="text-center border-l border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">${product.pricing.monthly}</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              )}
            </div>
          </div>

          {/* Rental Dates */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={rentalDates.startDate}
                  onChange={(e) =>
                    setRentalDates({ ...rentalDates, startDate: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={rentalDates.endDate}
                  onChange={(e) =>
                    setRentalDates({ ...rentalDates, endDate: e.target.value })
                  }
                  min={rentalDates.startDate || new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.inventory?.total || 1, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  {product.inventory?.available || 0} available
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          {calculateDays() > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {calculateDays()} day{calculateDays() > 1 ? 's' : ''} × {quantity} item
                    {quantity > 1 ? 's' : ''}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">${calculatePrice()}</p>
                </div>
                <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          )}

          {/* Vendor Info */}
          {product.vendor && (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {product.vendor.vendorInfo?.businessName || 'Vendor'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiShield className="w-4 h-4 text-green-500" />
                    Verified Vendor
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features & Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="font-medium text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rental Terms */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Rental Terms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <FiInfo className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Security Deposit</h3>
            <p className="text-sm text-gray-500">
              ${product.pricing?.deposit || 'N/A'} refundable deposit required
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <FiCalendar className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Minimum Rental</h3>
            <p className="text-sm text-gray-500">1 day minimum rental period</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <FiShield className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Protection Plan</h3>
            <p className="text-sm text-gray-500">Optional damage protection available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
