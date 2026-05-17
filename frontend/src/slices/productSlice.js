import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../services/product.service';

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

// Dummy products for the frontend-only workflow
const dummyProducts = [
  {
    _id: 'dummy-1',
    name: 'Sony A7 IV Camera',
    description: 'Professional mirrorless camera with 33MP full-frame sensor',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    pricing: { daily: 2500, weekly: 15000, monthly: 50000, securityDeposit: 10000 },
    ratings: { average: 4.9, count: 128 },
    category: 'Cameras',
    condition: 'Like New',
    availability: true,
    totalQuantity: 5,
    vendor: { name: 'Camera Pro Rentals' },
  },
  {
    _id: 'dummy-2',
    name: 'MacBook Pro 16"',
    description: 'M3 Pro chip, 18GB RAM, 512GB SSD - Perfect for professionals',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    pricing: { daily: 3500, weekly: 20000, monthly: 70000, securityDeposit: 25000 },
    ratings: { average: 4.8, count: 96 },
    category: 'Electronics',
    condition: 'Excellent',
    availability: true,
    totalQuantity: 3,
    vendor: { name: 'TechHub Rentals' },
  },
  {
    _id: 'dummy-3',
    name: 'DJI Mavic 3 Pro',
    description: 'Professional drone with 4/3 CMOS Hasselblad camera',
    images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'],
    pricing: { daily: 4500, weekly: 25000, monthly: 90000, securityDeposit: 30000 },
    ratings: { average: 4.9, count: 74 },
    category: 'Electronics',
    condition: 'New',
    availability: true,
    totalQuantity: 2,
    vendor: { name: 'Drone World' },
  },
  {
    _id: 'dummy-4',
    name: 'Canon RF 70-200mm f/2.8L',
    description: 'Professional telephoto lens IS USM',
    images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400'],
    pricing: { daily: 1800, weekly: 10000, monthly: 35000, securityDeposit: 15000 },
    ratings: { average: 4.7, count: 52 },
    category: 'Cameras',
    condition: 'Excellent',
    availability: false,
    totalQuantity: 1,
    vendor: { name: 'Camera Pro Rentals' },
  },
  {
    _id: 'dummy-5',
    name: 'JBL PartyBox 710',
    description: 'Powerful party speaker with 800W output and LED lights',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'],
    pricing: { daily: 2000, weekly: 12000, monthly: 40000, securityDeposit: 8000 },
    ratings: { average: 4.6, count: 89 },
    category: 'Audio',
    condition: 'Good',
    availability: true,
    totalQuantity: 4,
    vendor: { name: 'AudioMax' },
  },
  {
    _id: 'dummy-6',
    name: 'Bosch Power Drill Set',
    description: 'Professional cordless drill with 50+ accessories',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400'],
    pricing: { daily: 500, weekly: 3000, monthly: 10000, securityDeposit: 2000 },
    ratings: { average: 4.5, count: 145 },
    category: 'Tools',
    condition: 'Good',
    availability: true,
    totalQuantity: 10,
    vendor: { name: 'ToolMaster' },
  },
  {
    _id: 'dummy-7',
    name: 'Herman Miller Aeron Chair',
    description: 'Ergonomic office chair with full adjustability',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400'],
    pricing: { daily: 800, weekly: 5000, monthly: 18000, securityDeposit: 5000 },
    ratings: { average: 4.8, count: 67 },
    category: 'Furniture',
    condition: 'Excellent',
    availability: true,
    totalQuantity: 6,
    vendor: { name: 'Office Essentials' },
  },
  {
    _id: 'dummy-8',
    name: 'GoPro Hero 12 Black',
    description: 'Waterproof action camera with 5.3K video recording',
    images: ['https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400'],
    pricing: { daily: 1200, weekly: 7000, monthly: 25000, securityDeposit: 5000 },
    ratings: { average: 4.7, count: 203 },
    category: 'Cameras',
    condition: 'Like New',
    availability: true,
    totalQuantity: 8,
    vendor: { name: 'Camera Pro Rentals' },
  },
];

const initialState = {
  products: [],
  localProducts: dummyProducts, // Local products for frontend-only workflow
  product: null,
  categories: ['Electronics', 'Cameras', 'Audio', 'Tools', 'Furniture', 'Outdoor', 'Transport', 'Vehicles', 'Sports', 'Party', 'Clothing', 'Other'],
  pagination: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all products
export const getProducts = createAsyncThunk(
  'products/getAll',
  async (params, thunkAPI) => {
    try {
      return await productService.getProducts(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single product
export const getProduct = createAsyncThunk(
  'products/getOne',
  async (productId, thunkAPI) => {
    try {
      return await productService.getProduct(productId);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get categories
export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, thunkAPI) => {
    try {
      return await productService.getCategories();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create product (Vendor)
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await productService.createProduct(productData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update product (Vendor)
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ productId, productData }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await productService.updateProduct(productId, productData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete product (Vendor)
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (productId, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      await productService.deleteProduct(productId, token);
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get vendor products
export const getVendorProducts = createAsyncThunk(
  'products/getVendorProducts',
  async (params, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue('No authentication token found');
      return await productService.getVendorProducts(params, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearProduct: (state) => {
      state.product = null;
    },
    // Local product management (frontend-only workflow)
    addProductLocal: (state, action) => {
      const newProduct = {
        _id: `local-${Date.now()}`,
        ...action.payload,
        ratings: { average: 0, count: 0 },
        availability: true,
        createdAt: new Date().toISOString(),
      };
      state.localProducts.unshift(newProduct);
      state.isSuccess = true;
      state.message = 'Product added successfully';
    },
    updateProductLocal: (state, action) => {
      const index = state.localProducts.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.localProducts[index] = { ...state.localProducts[index], ...action.payload };
      }
    },
    deleteProductLocal: (state, action) => {
      state.localProducts = state.localProducts.filter(p => p._id !== action.payload);
    },
    getProductLocal: (state, action) => {
      state.product = state.localProducts.find(p => p._id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Single Product
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Categories
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Vendor Products
      .addCase(getVendorProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVendorProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getVendorProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearProduct, addProductLocal, updateProductLocal, deleteProductLocal, getProductLocal } = productSlice.actions;

// Selectors - Use API products if available, fallback to localProducts for demo
export const selectAllProducts = (state) => 
  state.products.products.length > 0 ? state.products.products : state.products.localProducts;
export const selectVendorProducts = (state) => state.products.products;
export const selectCategories = (state) => state.products.categories;

export default productSlice.reducer;
