import apiClient from './apiClient';
import type { SendOtpPayload, VerifyOtpPayload } from '@/types/auth.types';
import type { HomeApiResponse, HomeData } from '@/types/home.types';
import type {
  MyLearningResponse,
  Subject,
  MyLearningPagination,
} from '@/types/learning.types';
import type {
  LectureChapter,
  LectureByPaperResponse,
} from '@/types/lecture.types';
import type {
  AdmissionDetailsResponse,
  AdmissionDetailsData,
} from '@/types/admission.types';

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

// My Learning API
export const myLearningApi = async (
  page: number = 1
): Promise<{ subjects: Subject[]; pagination: MyLearningPagination }> => {
  const response = await apiClient.get<MyLearningResponse>(
    '/home/my-learning',
    { params: { page } }
  );
  return {
    subjects: response.data.data.subjects,
    pagination: response.data.pagination,
  };
};

// Switch Program API
export const switchProgramApi = async (programId: string) => {
  const response = await apiClient.post('/course/switch', {
    program_id: programId,
  });
  return response.data;
};

// Admission Details API
export const admissionDetailsApi = async (): Promise<AdmissionDetailsData> => {
  const response =
    await apiClient.get<AdmissionDetailsResponse>('/admission/details');
  return response.data.data;
};

// Course Lecture By Paper API
export const courseLecturesApi = async (
  paperId: string
): Promise<LectureChapter[]> => {
  const response = await apiClient.get<LectureByPaperResponse>(
    `/course/lecture-by-paper`,
    { params: { paper_id: paperId } }
  );
  return response.data.data;
};
