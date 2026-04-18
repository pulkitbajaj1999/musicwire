import axios from 'axios';
import { VITE_API_BASE_URL } from '../constants';

const axiosClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor (e.g., for Bearer Tokens)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;