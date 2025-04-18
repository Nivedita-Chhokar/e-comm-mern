// src/services/authService.js
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import api from './api';

// Function to handle Google sign-in
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in process...');
    
    // Trigger Google sign-in popup
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful');
    
    // Get the ID token from Firebase
    const idToken = await result.user.getIdToken();
    console.log('Firebase ID token retrieved');
    
    // Send the token to your backend
    console.log('Sending token to backend...');
    const response = await api.post('/auth/google-login', { token: idToken });
    console.log('Backend authentication successful');
    
    // Save the user's email along with the token for custom token verification
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userEmail', response.data.user.email);
    
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
      console.log('No token found in localStorage');
      return null;
    }
    
    // Verify token and get user data
    console.log('Fetching current user with token...');
    const response = await api.get('/auth/me');
    console.log('Current user fetched successfully');
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
    console.log('Signing out...');
    await signOut(auth);
    localStorage.removeItem('token');
    console.log('Sign out successful');
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