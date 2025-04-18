// common/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithGoogle, signOutUser, getCurrentUser } from '../utils/firebase';
import { googleLogin, getCurrentUser as fetchCurrentUser } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user session on initial render
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('authToken');
        
        if (token) {
          try {
            // Verify token with backend and get current user
            const userData = await fetchCurrentUser();
            setCurrentUser(userData);
            setUserRole(userData.role);
          } catch (error) {
            // If backend validation fails, clear localStorage
            console.error('Error validating token:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setCurrentUser(null);
            setUserRole(null);
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login with Google
  const login = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, authenticate with Firebase
      const { idToken } = await signInWithGoogle();
      
      // Then, validate with our backend
      const response = await googleLogin(idToken);
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setUserRole(response.user.role);
      
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response && error.response.status === 403) {
        setError('This email is not approved for access');
      } else {
        setError('Failed to sign in. Please try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    
    try {
      await signOutUser();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setCurrentUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    logout,
    isAdmin: userRole === 'admin',
    isRider: userRole === 'rider',
    isCustomer: userRole === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;