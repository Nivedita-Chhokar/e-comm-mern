import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, signInWithGoogle, logOut } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        setCurrentUser(user);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login with Google
  const login = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await logOut();
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const isRider = () => {
    return currentUser?.role === 'rider';
  };

  const isCustomer = () => {
    return currentUser?.role === 'customer';
  };

  // Value to be provided by the context
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isRider,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};