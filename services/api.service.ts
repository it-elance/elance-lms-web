import apiClient from './apiClient';
import type { LoginPayload } from '@/types/auth.types';

export const loginApi = async (body: LoginPayload) => {
  const response = await apiClient.post('/login/store', body);
  return response.data;
};

export const verifyOtpApi = async (body: LoginPayload) => {
  const response = await apiClient.post('/login/verify/otp', body);
  return response.data;
};
