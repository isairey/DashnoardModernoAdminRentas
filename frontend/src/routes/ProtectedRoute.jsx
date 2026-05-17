import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading, pendingVerification } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user has pending verification, redirect to verify-email
  if (pendingVerification) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect based on user role
    const redirectPath = {
      admin: '/admin/dashboard',
      vendor: '/vendor/dashboard',
      customer: '/',
    };
    return <Navigate to={redirectPath[user?.role] || '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
