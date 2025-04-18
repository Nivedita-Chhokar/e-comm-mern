// src/services/authService.js
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import api from './api';

// Function to handle Google sign-in
export const signInWithGoogle = async () => {
  try {
    // Trigger Google sign-in popup
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get the ID token from the signed-in user
    const idToken = await result.user.getIdToken();
    
    // Send the token to your backend
    const response = await api.post('/auth/google-login', { token: idToken });
    
    // Save the custom token returned from the backend
    localStorage.setItem('token', response.data.token);
    
    // Return user data
    return response.data.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Function to get the current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    // Verify token and get user data
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    // If there's an error (like expired token), clear localStorage
    localStorage.removeItem('token');
    return null;
  }
};

// Function to sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('token');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};