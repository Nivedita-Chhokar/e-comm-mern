import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Server might be down.');
    }
    
    if (error.response) {
      console.error(`Server responded with error ${error.response.status}:`, error.response.data);
      
      if (error.response.status === 401) {
        console.log('Unauthorized. Clearing token and redirecting to login.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response received from server:', error.request);
    } else {
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