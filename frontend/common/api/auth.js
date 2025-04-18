// common/api/auth.js
import apiClient from './index';

// Google login
export const googleLogin = async (token) => {
  try {
    const response = await apiClient.post('/auth/google-login', { token });
    return response.data;
  } catch (error) {
    console.error('Error in Google login:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export default {
  googleLogin,
  getCurrentUser,
};