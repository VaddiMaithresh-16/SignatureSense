import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5051',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add sessionId to request body if it's a POST request and sessionId exists
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId && config.method === 'post' && config.data) {
      // For FormData, we'll handle it in the service functions
      if (!(config.data instanceof FormData)) {
        config.data.sessionId = sessionId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 501 || error.response?.status === 404) {
      // Handle session expired or unauthorized access
      const message = error.response?.data?.message;
      if (message && (message.includes('login') || message.includes('Session'))) {
        localStorage.removeItem('sessionId');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const authService = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  signup: async (formData) => {
    const response = await api.post(API_ENDPOINTS.SIGNUP, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const verificationService = {
  verify: async (formData) => {
    // Add sessionId to FormData
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }
    
    const response = await api.post(API_ENDPOINTS.VERIFY, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const profileService = {
  getProfile: async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      console.error('No sessionId found in localStorage');
      throw new Error('No session found. Please login again.');
    }
    console.log('Fetching profile with sessionId:', sessionId.substring(0, 10) + '...');
    const response = await api.post(API_ENDPOINTS.PROFILE, { sessionId });
    console.log('Profile response:', response.data);
    return response.data;
  },
};

export default api;
