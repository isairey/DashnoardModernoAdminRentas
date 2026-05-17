import { Routes, Route } from 'react-router-dom';
import VendorLayout from '../layouts/VendorLayout';
import Dashboard from '../pages/vendor/Dashboard';
import Products from '../pages/vendor/Products';
import AddProduct from '../pages/vendor/AddProduct';
import Orders from '../pages/vendor/Orders';
import Invoices from '../pages/vendor/Invoices';
import Analytics from '../pages/vendor/Analytics';
import Profile from '../pages/shared/Profile';

// Placeholder components for remaining vendor pages
const EditProduct = () => <div className="p-6"><h1 className="text-2xl font-bold">Edit Product</h1></div>;
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>;

const VendorRoutes = () => {
  return (
    <Routes>
      <Route element={<VendorLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default VendorRoutes;
