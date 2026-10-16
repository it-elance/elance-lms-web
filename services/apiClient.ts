import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/constants/config';
import type { SessionTokens } from '@/types/auth.types';

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

type ErrorBody = { code?: string; message?: string };
type RetryableRequest = InternalAxiosRequestConfig & { _retried?: boolean };

// The response interceptor rejects with the backend body, { message, code }
export const isBatchCompletedError = (error: unknown): boolean =>
  (error as { code?: string } | null)?.code === BATCH_COMPLETED_CODE;

// Login and session endpoints answer 401 for a bad OTP or token, not for an expired session
const isAuthPath = (url?: string) => /^\/?(login|auth)\//.test(url ?? '');

// The session is over (the refresh token expired or was revoked, or the account was removed or
// deactivated). A full page load to /login also drops every cached query. Requests made without
// a session, such as a wrong OTP, are left alone.
const handleUnauthorized = (code?: string) => {
  if (isLoggingOut || !localStorage.getItem('accessToken')) return;
  isLoggingOut = true;

  const reason = code === STUDENT_INACTIVE_CODE ? 'inactive' : 'expired';
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.replace(`/login?${SESSION_EXPIRED_PARAM}=${reason}`);
};

// Access tokens are short-lived. When one expires, the refresh token buys a new pair. Requests
// that fail together wait for the same refresh, since each refresh token works only once. Other
// tabs share localStorage, so they pick up the new tokens too.
let refreshPromise: Promise<void> | null = null;

const refreshSession = (): Promise<void> => {
  if (!refreshPromise) {
    const refreshToken = localStorage.getItem('refreshToken');
    refreshPromise = axios
      .post<SessionTokens>(`${API_URL}/auth/refresh`, { refreshToken })
      .then(({ data }) => {
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
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

// A 401 means the access token is no longer valid. It is renewed once and the request sent
// again; if that isn't possible the student is logged out.
const retryWithNewToken = async (error: AxiosError<ErrorBody>) => {
  const request = error.config as RetryableRequest | undefined;
  const code = error.response?.data?.code;
  const sentToken = String(request?.headers?.Authorization ?? '').replace(
    'Bearer ',
    ''
  );

  if (
    !request ||
    request._retried ||
    !sentToken ||
    isAuthPath(request.url) ||
    code === STUDENT_INACTIVE_CODE ||
    !localStorage.getItem('refreshToken')
  ) {
    handleUnauthorized(code);
    return Promise.reject(error.response?.data || error);
  }

  try {
    // Another request, or another tab, may have refreshed the token in the meantime
    if (localStorage.getItem('accessToken') === sentToken) {
      await refreshSession();
    }
  } catch (refreshError) {
    const response = (refreshError as AxiosError<ErrorBody>).response;
    // A network or server error leaves the session alone, so the student can retry
    if (response?.status === 400 || response?.status === 401) {
      handleUnauthorized(response.data?.code);
    }
    return Promise.reject(error.response?.data || error);
  }

  request._retried = true;
  return apiClient(request);
};

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && typeof window !== 'undefined') {
      return retryWithNewToken(error);
    }

    if (status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error?.response?.data || error);
  }
);

export default apiClient;
