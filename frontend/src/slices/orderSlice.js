import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../services/order.service';

const initialState = {
  orders: [],
  order: null,
  stats: null,
  pagination: null,
  lastOrderInvoices: null, // Store invoices from multi-vendor checkout
  lastOrderSummary: null,  // Store summary from multi-vendor checkout
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Helper function to get token with localStorage fallback
const getToken = (thunkAPI) => {
  let token = thunkAPI.getState().auth.token;
  // Fallback to localStorage if token not in Redux state (e.g., after refresh)
  if (!token) {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        token = JSON.parse(userData).token;
      } catch (e) {
        console.error('Error parsing user data from localStorage');
      }
    }
  }
  return token;
};

// Create order
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await orderService.createOrder(orderData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get customer orders
export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (params, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await orderService.getMyOrders(params, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get vendor orders
export const getVendorOrders = createAsyncThunk(
  'orders/getVendorOrders',
  async (params, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await orderService.getVendorOrders(params, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single order
export const getOrder = createAsyncThunk(
  'orders/getOne',
  async (orderId, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await orderService.getOrder(orderId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await orderService.updateOrderStatus(orderId, { status }, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await orderService.cancelOrder(orderId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all orders (Admin)
export const getAllOrders = createAsyncThunk(
  'orders/getAll',
  async (params, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await orderService.getAllOrders(params, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get order stats
export const getOrderStats = createAsyncThunk(
  'orders/getStats',
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await orderService.getOrderStats(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order (supports multi-vendor checkout)
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Handle both single order and multi-order responses
        const orderData = action.payload.data;
        if (Array.isArray(orderData)) {
          // Multi-vendor: add all orders to the list
          state.order = orderData[0]; // Set first order as current
          state.orders = [...orderData, ...state.orders];
        } else {
          // Single vendor: handle as before
          state.order = orderData;
          state.orders = [orderData, ...state.orders];
        }
        // Store invoice info if present
        state.lastOrderInvoices = action.payload.invoices;
        state.lastOrderSummary = action.payload.summary;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Vendor Orders
      .addCase(getVendorOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVendorOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getVendorOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Single Order
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get All Orders (Admin)
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Order Stats
      .addCase(getOrderStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(getOrderStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
