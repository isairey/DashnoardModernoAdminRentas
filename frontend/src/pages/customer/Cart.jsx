import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartItemsCount,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../../slices/cartSlice';
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiPackage,
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemsCount);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const rentalPeriod = useSelector((state) => state.cart.rentalPeriod);

  // Calculate days and totals
  const calculateDays = () => {
    if (!rentalPeriod.startDate || !rentalPeriod.endDate) return 1;
    const days = Math.ceil(
      (new Date(rentalPeriod.endDate) - new Date(rentalPeriod.startDate)) / (1000 * 60 * 60 * 24)
    );
    return Math.max(days, 1);
  };

  const days = calculateDays();

  const calculateItemTotal = (item) => {
    const dailyRate = item.product?.pricing?.daily || 0;
    return dailyRate * item.quantity * days;
  };

  const cartTotal = cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/customer/checkout');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
          <FiShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-center max-w-sm mb-6">
          Browse our products and find something to rent!
        </p>
        <Link 
          to="/customer/products" 
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Browse Products
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1">
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/customer/products/${item.product._id}`}
                          className="text-base font-medium text-gray-900 hover:text-gray-700 line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.product.category || 'General'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Rental Period */}
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(rentalPeriod.startDate)} — {formatDate(rentalPeriod.endDate)} · {days} day{days !== 1 ? 's' : ''}
                    </p>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.product?.pricing?.daily || 0)}/day × {days}
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {formatCurrency(calculateItemTotal(item))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              to="/customer/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-24">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items Summary */}
              <div className="space-y-2 pb-4 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate flex-1 mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium whitespace-nowrap">
                      {formatCurrency(calculateItemTotal(item))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="py-4 space-y-2 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Fee (10%)</span>
                  <span className="text-gray-900">{formatCurrency(cartTotal * 0.1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="text-gray-400 text-xs">At checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {formatCurrency(cartTotal * 1.1)}
                  </span>
                </div>
                
                <button 
                  onClick={handleCheckout} 
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Security deposit refunded after item return
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
