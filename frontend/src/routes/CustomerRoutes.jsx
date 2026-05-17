import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import Home from '../pages/customer/Home';
import Products from '../pages/customer/Products';
import ProductDetail from '../pages/customer/ProductDetail';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import MyOrders from '../pages/customer/MyOrders';
import OrderDetail from '../pages/customer/OrderDetail';
import CustomerDashboard from '../pages/customer/Dashboard';
import Invoices from '../pages/customer/Invoices';
import Favorites from '../pages/customer/Favorites';
import Profile from '../pages/shared/Profile';

// Placeholder components
const Settings = () => <div className="space-y-6"><div className="bg-white border border-gray-200 rounded-lg p-6"><h1 className="text-xl font-semibold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Account settings will be displayed here</p></div></div>;

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<Products />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Products />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
