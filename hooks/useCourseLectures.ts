'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { courseLecturesApi } from '@/services/api.service';
import type { LectureChapter } from '@/types/lecture.types';

// Every paper's lecture list, e.g. to refresh completion checkmarks
export const ALL_COURSE_LECTURES_QUERY_KEY = ['course-lectures'] as const;

export const COURSE_LECTURES_QUERY_KEY = (
  paperId: string,
  batchId?: string | null
) =>
  [
    ...ALL_COURSE_LECTURES_QUERY_KEY,
    { paperId, batchId: batchId ?? '' },
  ] as const;

// A paper's chapters and lectures: of all the student's batches of it, or of batchId alone
export const useCourseLectures = (paperId: string, batchId?: string | null) => {
  const { data, isLoading, error } = useQuery<LectureChapter[]>({
    queryKey: COURSE_LECTURES_QUERY_KEY(paperId, batchId),
    queryFn: async () => {
      const response = await courseLecturesApi(paperId, batchId);
      return response.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    enabled: !!paperId,
    // Lectures a tutor deletes or unpublishes should drop out soon: refresh after
    // 30 seconds, and when the student comes back to the tab
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  return {
    chapters: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
