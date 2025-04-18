// src/services/api.js
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the auth token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;