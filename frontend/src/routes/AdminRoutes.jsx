import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import UsersManagement from '../pages/admin/UsersManagement';
import ProductsManagement from '../pages/admin/ProductsManagement';
import OrdersManagement from '../pages/admin/OrdersManagement';
import InvoicesManagement from '../pages/admin/InvoicesManagement';
import Analytics from '../pages/admin/Analytics';
import Profile from '../pages/shared/Profile';

// Placeholder components for remaining admin pages
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>;

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="invoices" element={<InvoicesManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
