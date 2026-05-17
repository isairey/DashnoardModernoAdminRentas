import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardService from '../services/dashboard.service';

// Helper to get token
const getToken = (thunkAPI) => {
  let token = thunkAPI.getState().auth.token;
  if (!token) {
    token = localStorage.getItem('token');
  }
  return token;
};

// Async thunks
export const fetchVendorDashboard = createAsyncThunk(
  'dashboard/fetchVendor',
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      console.log('Dashboard: Token found:', !!token);
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token');
      }
      const response = await dashboardService.getVendorDashboard();
      console.log('Dashboard API Response:', response);
      // response is already { success, data } from service
      return response.data;
    } catch (error) {
      console.error('Dashboard API Error:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch vendor dashboard'
      );
    }
  }
);

export const fetchAdminDashboard = createAsyncThunk(
  'dashboard/fetchAdmin',
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token');
      }
      const response = await dashboardService.getAdminDashboard();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch admin dashboard'
      );
    }
  }
);

export const fetchCustomerDashboard = createAsyncThunk(
  'dashboard/fetchCustomer',
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token');
      }
      const response = await dashboardService.getCustomerDashboard();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch customer dashboard'
      );
    }
  }
);

const initialState = {
  vendor: {
    stats: null,
    recentOrders: [],
    lowStockProducts: [],
    monthlyRevenue: [],
    loading: false,
    error: null
  },
  admin: {
    stats: null,
    recentOrders: [],
    topVendors: [],
    monthlyStats: [],
    loading: false,
    error: null
  },
  customer: {
    stats: null,
    recentRentals: [],
    upcomingReturns: [],
    loading: false,
    error: null
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.vendor = initialState.vendor;
      state.admin = initialState.admin;
      state.customer = initialState.customer;
    }
  },
  extraReducers: (builder) => {
    builder
      // Vendor dashboard
      .addCase(fetchVendorDashboard.pending, (state) => {
        state.vendor.loading = true;
        state.vendor.error = null;
      })
      .addCase(fetchVendorDashboard.fulfilled, (state, action) => {
        state.vendor.loading = false;
        state.vendor.stats = action.payload.stats;
        state.vendor.recentOrders = action.payload.recentOrders;
        state.vendor.lowStockProducts = action.payload.lowStockProducts;
        state.vendor.monthlyRevenue = action.payload.monthlyRevenue;
      })
      .addCase(fetchVendorDashboard.rejected, (state, action) => {
        state.vendor.loading = false;
        state.vendor.error = action.payload;
      })
      
      // Admin dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.admin.loading = false;
        state.admin.stats = action.payload.stats;
        state.admin.recentOrders = action.payload.recentOrders;
        state.admin.topVendors = action.payload.topVendors;
        state.admin.monthlyStats = action.payload.monthlyStats;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.payload;
      })
      
      // Customer dashboard
      .addCase(fetchCustomerDashboard.pending, (state) => {
        state.customer.loading = true;
        state.customer.error = null;
      })
      .addCase(fetchCustomerDashboard.fulfilled, (state, action) => {
        state.customer.loading = false;
        state.customer.stats = action.payload.stats;
        state.customer.recentRentals = action.payload.recentRentals;
        state.customer.upcomingReturns = action.payload.upcomingReturns;
      })
      .addCase(fetchCustomerDashboard.rejected, (state, action) => {
        state.customer.loading = false;
        state.customer.error = action.payload;
      });
  }
});

export const { clearDashboard } = dashboardSlice.actions;

// Selectors
export const selectVendorDashboard = (state) => state.dashboard.vendor;
export const selectAdminDashboard = (state) => state.dashboard.admin;
export const selectCustomerDashboard = (state) => state.dashboard.customer;

export default dashboardSlice.reducer;
