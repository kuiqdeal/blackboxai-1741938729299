import axios from 'axios';
import { toast } from 'react-toastify';
import store from '../store';
import { logout } from '../store/slices/authSlice';

// Create axios instance with default config
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth state and redirect to login
          store.dispatch(logout());
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation error
          const validationErrors = response.data.errors;
          if (validationErrors) {
            Object.values(validationErrors).forEach((error: any) => {
              toast.error(error as string);
            });
          } else {
            toast.error(response.data.message || 'Validation failed.');
          }
          break;
        case 429:
          // Too many requests
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          // Server error
          toast.error('Internal server error. Please try again later.');
          break;
        default:
          // Other errors
          toast.error(response.data.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Unable to connect to the server. Please check your internet connection.');
    } else {
      // Error in request configuration
      toast.error('An error occurred while making the request.');
    }

    return Promise.reject(error);
  }
);

export default instance;
