import axios from 'axios';
import { API_URL } from '@/constants/config';

export const SESSION_EXPIRED_PARAM = 'session';
// Sent by the backend with the 401 when the student was deactivated or deleted
export const STUDENT_INACTIVE_CODE = 'STUDENT_INACTIVE';
export const STUDENT_INACTIVE_MESSAGE =
  'Your account is inactive. Please contact support.';
// Sent by the backend with the 403 for a completed batch's videos and materials
export const BATCH_COMPLETED_CODE = 'BATCH_COMPLETED';
export const BATCH_COMPLETED_MESSAGE =
  'This batch is completed. Its videos and materials are no longer available.';
let isLoggingOut = false;

// The response interceptor rejects with the backend body, { message, code }
export const isBatchCompletedError = (error: unknown): boolean =>
  (error as { code?: string } | null)?.code === BATCH_COMPLETED_CODE;

// A 401 means the session is no longer valid (expired token, or the account was
// removed or deactivated). A full page load to /login also drops every cached
// query. Requests made without a session, such as a wrong OTP, are left alone.
const handleUnauthorized = (code?: string) => {
  if (isLoggingOut || !localStorage.getItem('accessToken')) return;
  isLoggingOut = true;

  const reason = code === STUDENT_INACTIVE_CODE ? 'inactive' : 'expired';
  localStorage.removeItem('accessToken');
  window.location.replace(`/login?${SESSION_EXPIRED_PARAM}=${reason}`);
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
      handleUnauthorized(error.response?.data?.code);
    }

    if (status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error?.response?.data || error);
  }
);

export default apiClient;
