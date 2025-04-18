// src/services/api.js
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to catch server connection issues
  timeout: 10000,
});

// Add a request interceptor to attach the auth token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request headers');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle connection errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Server might be down.');
    }
    
    // Handle server errors
    if (error.response) {
      console.error(`Server responded with error ${error.response.status}:`, error.response.data);
      
      // Handle session expiration
      if (error.response.status === 401) {
        console.log('Unauthorized. Clearing token and redirecting to login.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Add email as query parameter for custom token verification
      if (email && !config.params) {
        config.params = { email };
      } else if (email) {
        config.params = { ...config.params, email };
      }
      
      console.log('Added token to request headers');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default api;