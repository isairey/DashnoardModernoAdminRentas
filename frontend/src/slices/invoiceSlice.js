import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import invoiceService from '../services/invoice.service';

const initialState = {
  invoices: [],
  invoice: null,
  pagination: null,
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

// Create invoice
export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (invoiceData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await invoiceService.createInvoice(invoiceData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get invoice
export const getInvoice = createAsyncThunk(
  'invoices/getOne',
  async (invoiceId, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await invoiceService.getInvoice(invoiceId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get customer invoices
export const getMyInvoices = createAsyncThunk(
  'invoices/getMyInvoices',
  async (params, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await invoiceService.getMyInvoices(params, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get vendor invoices
export const getVendorInvoices = createAsyncThunk(
  'invoices/getVendorInvoices',
  async (params, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await invoiceService.getVendorInvoices(params, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update invoice status
export const updateInvoiceStatus = createAsyncThunk(
  'invoices/updateStatus',
  async ({ invoiceId, status }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await invoiceService.updateInvoiceStatus(invoiceId, status, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all invoices (Admin)
export const getAllInvoices = createAsyncThunk(
  'invoices/getAll',
  async (params, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await invoiceService.getAllInvoices(params, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearInvoice: (state) => {
      state.invoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
        state.invoices.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Invoice
      .addCase(getInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(getInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get My Invoices
      .addCase(getMyInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoices = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Vendor Invoices
      .addCase(getVendorInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVendorInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoices = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getVendorInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Invoice Status
      .addCase(updateInvoiceStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
        const index = state.invoices.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(updateInvoiceStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get All Invoices (Admin)
      .addCase(getAllInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoices = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
