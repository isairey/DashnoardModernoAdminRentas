import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return null;
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const defaultState = {
  items: [],
  rentalPeriod: {
    startDate: null,
    endDate: null,
  },
  deliveryMethod: 'pickup',
  deliveryAddress: null,
};

// Use saved cart or default state
const initialState = loadCartFromStorage() || defaultState;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        item => item.product._id === action.payload.product._id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      // Also set the rental period from the item being added
      if (action.payload.startDate && action.payload.endDate) {
        state.rentalPeriod = {
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
        };
      }
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        item => item.product._id !== action.payload
      );
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(
        item => item.product._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
      saveCartToStorage(state);
    },
    setRentalPeriod: (state, action) => {
      state.rentalPeriod = action.payload;
      saveCartToStorage(state);
    },
    setDeliveryMethod: (state, action) => {
      state.deliveryMethod = action.payload;
      saveCartToStorage(state);
    },
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.rentalPeriod = { startDate: null, endDate: null };
      state.deliveryMethod = 'pickup';
      state.deliveryAddress = null;
      localStorage.removeItem('cart');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setRentalPeriod,
  setDeliveryMethod,
  setDeliveryAddress,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => {
  // Try to get dates from rental period first, then fall back to first item's dates
  let startDate = state.cart.rentalPeriod?.startDate;
  let endDate = state.cart.rentalPeriod?.endDate;
  
  // Fallback to first item's dates if rental period not set
  if ((!startDate || !endDate) && state.cart.items.length > 0) {
    startDate = state.cart.items[0].startDate;
    endDate = state.cart.items[0].endDate;
  }
  
  // If still no dates, use item's pre-calculated totalPrice or default to daily rate
  if (!startDate || !endDate) {
    return state.cart.items.reduce((total, item) => {
      if (item.totalPrice) return total + item.totalPrice;
      return total + (item.product?.pricing?.daily || 0) * item.quantity;
    }, 0);
  }
  
  const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
  
  return state.cart.items.reduce((total, item) => {
    const dailyRate = item.product?.pricing?.daily || 0;
    return total + (dailyRate * item.quantity * days);
  }, 0);
};
export const selectCartItemsCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
