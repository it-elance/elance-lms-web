import apiClient from './apiClient';
import type { SendOtpPayload, VerifyOtpPayload } from '@/types/auth.types';
import type { HomeApiResponse, HomeData } from '@/types/home.types';

// Login API
export const loginApi = async (body: SendOtpPayload) => {
  const response = await apiClient.post('/login/store', body);
  return response.data;
};

// Verify OTP API
export const verifyOtpApi = async (
  body: VerifyOtpPayload
): Promise<{ token: string }> => {
  const response = await apiClient.post<{ token: string }>(
    '/login/verify/otp',
    body
  );
  return response.data;
};

// Home API
export const homeApi = async (): Promise<HomeData> => {
  const response = await apiClient.get<HomeApiResponse>('/home');
  return response.data.data;
};

// Switch Program API
export const switchProgramApi = async (programId: string) => {
  const response = await apiClient.post('/course/switch', {
    program_id: programId,
  });
  return response.data;
};
