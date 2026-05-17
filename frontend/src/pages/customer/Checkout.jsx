import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../../slices/cartSlice';
import { createOrder } from '../../slices/orderSlice';

// Helper to calculate item price
const calculateItemPrice = (item, startDate, endDate) => {
  const dailyRate = item.product?.pricing?.daily || 0;
  if (!startDate || !endDate) return dailyRate * item.quantity;
  const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
  return dailyRate * item.quantity * days;
};
import { toast } from 'react-toastify';
import {
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
} from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal) || 0;
  const rentalPeriod = useSelector((state) => state.cart.rentalPeriod);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Check authentication - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please login to proceed with checkout');
      navigate('/login', { state: { from: '/customer/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  const serviceFee = cartTotal * 0.1;
  const totalAmount = cartTotal + serviceFee;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingInfo[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    } else if (step === 2) {
      if (!agreedToTerms) {
        toast.error('Please agree to the rental terms');
        return;
      }
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    // Get rental dates from cart state, or default to 7 days from now
    const defaultStartDate = new Date();
    const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const startDate = rentalPeriod?.startDate || defaultStartDate.toISOString();
    const endDate = rentalPeriod?.endDate || defaultEndDate.toISOString();
    
    // Format order data to match backend expectations
    const orderData = {
      items: cartItems.map((item) => ({
        productId: item.product._id, // Backend expects productId, not product
        quantity: item.quantity,
      })),
      rentalPeriod: {
        startDate,
        endDate,
      },
      deliveryMethod: 'pickup', // Default to pickup for now
      deliveryAddress: {
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
      },
      notes: `Contact: ${shippingInfo.fullName}, ${shippingInfo.phone}, ${shippingInfo.email}`,
    };

    console.log('Creating order with data:', orderData);

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order created successfully:', result);
      dispatch(clearCart());
      toast.success('🎉 Payment successful! Order placed successfully.');
      navigate('/customer/orders');
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error(error?.message || error || 'Failed to place order');
    }
  };

  // Don't render if not authenticated (wait for redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to proceed with checkout</p>
          <button 
            onClick={() => navigate('/customer/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step > 1 ? <FiCheckCircle className="w-5 h-5" /> : '1'}
          </div>
          <span className="ml-2 font-medium text-gray-900">Shipping</span>
        </div>
        <div className={`w-20 h-0.5 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            2
          </div>
          <span className="ml-2 font-medium text-gray-900">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {step === 1 ? (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline w-4 h-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="inline w-4 h-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiPhone className="inline w-4 h-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline w-4 h-4 mr-1" />
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <label
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <FiCreditCard className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Secure payment via Stripe</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <FiPackage className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Cash on Pickup</p>
                    <p className="text-sm text-gray-500">Pay when you pick up the items</p>
                  </div>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded mt-0.5"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the rental terms and conditions. I understand that a security
                    deposit may be required and will be refunded upon successful return of
                    items in good condition.
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <FiLock className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-secondary">
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : step === 1 ? (
                'Continue to Payment'
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4 pb-4 border-b border-gray-200">
              {cartItems.map((item) => {
                const itemPrice = calculateItemPrice(item, rentalPeriod?.startDate, rentalPeriod?.endDate);
                return (
                  <div key={item.product._id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiPackage className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {rentalPeriod?.startDate ? formatDate(rentalPeriod.startDate) : 'Start'} - {rentalPeriod?.endDate ? formatDate(rentalPeriod.endDate) : 'End'}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        ₹{itemPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="py-4 space-y-2 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Fee (10%)</span>
                <span className="text-gray-900">₹{serviceFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
