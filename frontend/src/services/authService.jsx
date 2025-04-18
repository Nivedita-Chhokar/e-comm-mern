import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import api from './api';

export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in process...');
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful');
    
    const idToken = await result.user.getIdToken();
    console.log('Firebase ID token retrieved');
    
    console.log('Sending token to backend...');
    const response = await api.post('/auth/google-login', { token: idToken });
    console.log('Backend authentication successful');
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userEmail', response.data.user.email);
    
    return response.data.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found in localStorage');
      return null;
    }
    
    console.log('Fetching current user with token...');
    const response = await api.get('/auth/me');
    console.log('Current user fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    
    localStorage.removeItem('token');
    return null;
  }
};

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

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};