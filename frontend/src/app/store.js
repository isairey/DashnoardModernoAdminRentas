import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import productReducer from '../slices/productSlice';
import orderReducer from '../slices/orderSlice';
import cartReducer from '../slices/cartSlice';
import invoiceReducer from '../slices/invoiceSlice';
import dashboardReducer from '../slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    cart: cartReducer,
    invoices: invoiceReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
