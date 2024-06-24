import axios from 'axios';
import { getCurrentUser } from './authService';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Base URL for your API
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user && user.access_token) {
      config.headers['Authorization'] = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error
      // Optionally redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
