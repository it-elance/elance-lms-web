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
import type {
  LectureVideoData,
  LectureVideoResponse,
  PaperDetailsData,
  PaperDetailsResponse,
} from '@/types/lecture.types';
import type {
  Note,
  CreateNotePayload,
  UpdateNotePayload,
  DeleteNotePayload,
} from '@/types/note.types';
import type {
  AnalyticsApiResponse,
  AnalyticsData,
} from '@/types/analytics.types';

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

// Course Video By Lecture API
export const lectureVideoApi = async (
  lectureId: string
): Promise<LectureVideoData> => {
  const response = await apiClient.get<LectureVideoResponse>(
    `/course/video-by-lecture`,
    {
      params: { lecture_id: lectureId },
    }
  );
  return response.data.data.data;
};

// Paper Details API
export const paperDetailsApi = async (
  paperId: string
): Promise<PaperDetailsData> => {
  const response = await apiClient.get<PaperDetailsResponse>(
    `/course/paper-details`,
    {
      params: { paper_id: paperId },
    }
  );
  return response.data.data.data;
};

// Notes API
export const getNotesApi = async (videoId: string): Promise<Note[]> => {
  const response = await apiClient.get<{ status: string; data: Note[] }>(
    '/note',
    {
      params: { video_id: videoId },
    }
  );
  return response.data.data;
};

export const createNoteApi = async (body: CreateNotePayload) => {
  const response = await apiClient.post('/note', body);
  return response.data;
};

export const updateNoteApi = async (body: UpdateNotePayload) => {
  const response = await apiClient.put('/note', body);
  return response.data;
};

export const deleteNoteApi = async (body: DeleteNotePayload) => {
  const response = await apiClient.delete('/note', { data: body });
  return response.data;
};

// Analytics API
export const getAnalyticsApi = async (): Promise<AnalyticsData> => {
  const response = await apiClient.get<AnalyticsApiResponse>('/analytics');
  return response.data.data;
};
