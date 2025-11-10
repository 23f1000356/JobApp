import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Get the API URL from Vite environment or use the proxy path
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/auth
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    // Ensure headers object exists
    config.headers = config.headers || {};
    
    // Only add the token if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details for debugging
    console.debug('[API] Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: {
        ...config.headers,
        // Don't log the full Authorization header for security
        Authorization: config.headers.Authorization ? 'Bearer [token]' : undefined,
      },
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.debug('[API] Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    
    // Log the error
    console.error('[API] Response Error:', {
      message: error.message,
      status: error.response?.status,
      url: originalRequest?.url,
      data: error.response?.data
    });

    // Handle token expiration (401) - you can add token refresh logic here
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Add token refresh logic here if needed
    }

    // Return a standardized error object
    const errorData = error.response?.data as { message?: string };
    return Promise.reject({
      status: error.response?.status || 500,
      message: errorData?.message || error.message || 'An unknown error occurred',
      data: error.response?.data,
    });
  }
);

// Add a request/response interceptor for network errors
const NETWORK_ERROR_CODES = ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'];

api.interceptors.response.use(
  response => response,
  error => {
    if (NETWORK_ERROR_CODES.includes(error.code) || !error.response) {
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your internet connection and try again.',
        isNetworkError: true
      });
    }
    return Promise.reject(error);
  }
);

export default api;