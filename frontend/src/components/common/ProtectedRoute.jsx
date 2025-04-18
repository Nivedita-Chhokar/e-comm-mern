import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from './Loading';

// Base protected route for any authenticated user
export const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

// Protected route for admin users
export const AdminRoute = () => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return isAdmin() ? <Outlet /> : <Navigate to="/unauthorized" />;
};

// Protected route for rider users
export const RiderRoute = () => {
  const { currentUser, loading, isRider } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return isRider() ? <Outlet /> : <Navigate to="/unauthorized" />;
};

// Protected route for customer users
export const CustomerRoute = () => {
  const { currentUser, loading, isCustomer } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return isCustomer() ? <Outlet /> : <Navigate to="/unauthorized" />;
};