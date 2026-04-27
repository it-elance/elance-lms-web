import axios from 'axios';
import { API_URL } from '@/constants/config';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (req) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');

      if (token) {
        req.headers = req.headers || {};
        req.headers.Authorization = `Bearer ${token}`;
      }
    }

    return req;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    // if (status === 401) {
    //   if (typeof window !== 'undefined') {
    //     localStorage.removeItem('accessToken');
    //     window.location.href = '/';
    //   }
    // }

    if (status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error?.response?.data || error);
  }
);

export default apiClient;
