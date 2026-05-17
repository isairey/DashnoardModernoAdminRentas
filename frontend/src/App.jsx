import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getMe } from './slices/authSlice';
import { ProtectedRoute, AdminRoutes, VendorRoutes, CustomerRoutes } from './routes';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import OTPLogin from './pages/auth/OTPLogin';
import LandingPage from './pages/LandingPage';
import TermsAndConditions from './pages/TermsAndConditions';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, pendingVerification } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is logged in on app load
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed?.token) {
          dispatch(getMe());
        } else {
          // No valid token, clear stale data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch {
        // Invalid JSON, clear stale data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    user?.role === 'admin'
                      ? '/admin/dashboard'
                      : user?.role === 'vendor'
                      ? '/vendor/dashboard'
                      : '/customer/dashboard'
                  }
                  replace
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    user?.role === 'admin'
                      ? '/admin/dashboard'
                      : user?.role === 'vendor'
                      ? '/vendor/dashboard'
                      : '/customer/dashboard'
                  }
                  replace
                />
              ) : pendingVerification ? (
                // User has pending verification - redirect to verify-email
                <Navigate to="/verify-email" replace />
              ) : (
                <Register />
              )
            }
          />
          
          {/* Email Verification Route - accessible only with pending verification */}
          <Route 
            path="/verify-email" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <VerifyEmail />
              )
            } 
          />
          
          {/* OTP Login Route */}
          <Route path="/otp-login" element={<OTPLogin />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>

          {/* Vendor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
            <Route path="/vendor/*" element={<VendorRoutes />} />
          </Route>

          {/* Customer Routes (accessible to all authenticated users and guests) */}
          <Route path="/customer/*" element={<CustomerRoutes />} />
          
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Terms & Conditions */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<TermsAndConditions />} />
          
          {/* Fallback redirect */}
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
