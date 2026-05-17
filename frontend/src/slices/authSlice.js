import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/auth.service';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
// Get pending verification from sessionStorage (survives page refresh but not browser close)
const pendingVerification = JSON.parse(sessionStorage.getItem('pendingVerification'));

const initialState = {
  user: user ? user.user : null,
  token: user ? user.token : null,
  companies: user ? user.companies : [],
  activeCompany: user ? user.user?.activeCompany : null,
  requiresCompanySelection: false,
  isAuthenticated: user?.token ? true : false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  // NEW: Pending verification state - separate from authenticated state
  pendingVerification: pendingVerification || null, // { email, userId, emailSent }
  registrationComplete: false, // Flag to trigger navigation
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Select company
export const selectCompany = createAsyncThunk(
  'auth/selectCompany',
  async (companyId, thunkAPI) => {
    try {
      let token = thunkAPI.getState().auth.token;
      if (!token) {
        const userData = localStorage.getItem('user');
        if (userData) {
          token = JSON.parse(userData).token;
        }
      }
      return await authService.selectCompany(companyId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

// Get current user
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      let token = thunkAPI.getState().auth.token;
      // Fallback to localStorage if token not in state
      if (!token) {
        const userData = localStorage.getItem('user');
        if (userData) {
          token = JSON.parse(userData).token;
        }
      }
      if (!token) {
        // Clear any stale localStorage data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return thunkAPI.rejectWithValue('No token found');
      }
      return await authService.getMe(token);
    } catch (error) {
      // Clear invalid token from localStorage on auth failure
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await authService.updateProfile(userData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.registrationComplete = false;
    },
    setActiveCompany: (state, action) => {
      state.activeCompany = action.payload;
    },
    // NEW: Clear pending verification after successful verification
    clearPendingVerification: (state) => {
      state.pendingVerification = null;
      sessionStorage.removeItem('pendingVerification');
    },
    // NEW: Set pending verification (for page refresh recovery)
    setPendingVerification: (state, action) => {
      state.pendingVerification = action.payload;
      if (action.payload) {
        sessionStorage.setItem('pendingVerification', JSON.stringify(action.payload));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.registrationComplete = true;
        
        // Check if email verification is required
        if (action.payload.requiresEmailVerification) {
          // Don't set authenticated - user must verify email first
          state.isAuthenticated = false;
          state.user = null; // Don't store user in main state until verified
          state.token = null;
          
          // Store pending verification info separately
          state.pendingVerification = {
            email: action.payload.user.email,
            userId: action.payload.user.id,
            name: action.payload.user.name,
            role: action.payload.user.role,
            emailSent: action.payload.emailSent
          };
          // Persist to sessionStorage for page refresh recovery
          sessionStorage.setItem('pendingVerification', JSON.stringify(state.pendingVerification));
        } else {
          // Email verification skipped - full authentication
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.companies = action.payload.companies || [];
          state.activeCompany = action.payload.user?.activeCompany || null;
          state.requiresCompanySelection = action.payload.requiresCompanySelection || false;
          state.pendingVerification = null;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.companies = action.payload.companies || [];
        state.activeCompany = action.payload.user?.activeCompany || null;
        state.requiresCompanySelection = action.payload.requiresCompanySelection || false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Select Company
      .addCase(selectCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(selectCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.activeCompany = action.payload.user?.activeCompany || null;
        state.requiresCompanySelection = false;
      })
      .addCase(selectCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.companies = [];
        state.activeCompany = null;
        state.isAuthenticated = false;
        state.requiresCompanySelection = false;
        state.pendingVerification = null;
        sessionStorage.removeItem('pendingVerification');
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.companies = action.payload.companies || [];
        state.activeCompany = action.payload.activeCompany || null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        // Don't set error for silent auth check failures
        if (action.payload !== 'No token found') {
          state.isError = true;
          state.message = action.payload;
        }
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        // Update localStorage with the new user data
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          userData.user = action.payload;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setActiveCompany, clearPendingVerification, setPendingVerification } = authSlice.actions;
export default authSlice.reducer;
