import axios from 'axios';
import { API_URL } from '@/constants/config';

export const SESSION_EXPIRED_PARAM = 'session';
let isLoggingOut = false;

// A 401 means the session is no longer valid (expired token, or the account was
// removed). A full page load to /login also drops every cached query. Requests
// made without a session, such as a wrong OTP, are left alone.
const handleUnauthorized = () => {
  if (isLoggingOut || !localStorage.getItem('accessToken')) return;
  isLoggingOut = true;

  localStorage.removeItem('accessToken');
  window.location.replace(`/login?${SESSION_EXPIRED_PARAM}=expired`);
};

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

    if (status === 401 && typeof window !== 'undefined') {
      handleUnauthorized();
    }

    if (status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error?.response?.data || error);
  }
);

export default apiClient;
