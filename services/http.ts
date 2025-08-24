import axios from 'axios';

import { authCookieName } from '@/constants/config.constant';
import { getLocalStorage } from '@/utils';

// Debug: Log the environment variable
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

// Create an Axios instance with a base URL from environment variables
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', // Fallback to localhost:3001
});

// Request Interceptor: Add token to headers or other modifications
http.interceptors.request.use(
  (config) => {
    // First try to get token from localStorage
    let token = getLocalStorage('auth_token');

    // If not found in localStorage, try to get from cookie
    if (!token && typeof document !== 'undefined') {
      token = document.cookie
        .split('; ')
        .find((row) => row.startsWith(authCookieName))
        ?.split('=')[1];
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config; // Ensure config is returned or request will not be sent
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global responses or errors
http.interceptors.response.use(
  (response) => {
    // You can log or modify the response here

    return response; // Ensure response is returned or the calling function will not get it
  },
  (error) => {
    // Handle global errors here (e.g., token expiration)
    if (error.response && error.response.status === 401) {
      // For example, redirect to login if token expired
    }

    return Promise.reject(error); // Ensure error is propagated
  }
);

export default http;
