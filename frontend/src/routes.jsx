import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { 
  ProtectedRoute, 
  AdminRoute, 
  RiderRoute, 
  CustomerRoute 
} from './components/common/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Unauthorized from './pages/auth/Unauthorized';

// Common pages
import UserProfile from './pages/common/UserProfile';

// Customer pages
import Home from './pages/customer/Home';
import ProductCatalog from './pages/customer/ProductCatalog';
import ProductView from './pages/customer/ProductView';
import CartPage from './pages/customer/CartPage';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

// Rider pages
import RiderDashboard from './pages/rider/RiderDashboard';
import AssignedOrders from './pages/rider/AssignedOrders';
import OrderDelivery from './pages/rider/OrderDelivery';

// NotFound page
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Public customer routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductCatalog />} />
      <Route path="/products/:id" element={<ProductView />} />
      <Route path="/cart" element={<CartPage />} />
      
      {/* Protected routes for any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<UserProfile />} />
      </Route>
      
      {/* Protected customer routes */}
      <Route element={<CustomerRoute />}>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Route>
      
      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/profile" element={<UserProfile />} />
      </Route>
      
      {/* Rider routes */}
      <Route element={<RiderRoute />}>
        <Route path="/rider/dashboard" element={<RiderDashboard />} />
        <Route path="/rider/orders" element={<AssignedOrders />} />
        <Route path="/rider/orders/:id" element={<OrderDelivery />} />
        <Route path="/rider/profile" element={<UserProfile />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;