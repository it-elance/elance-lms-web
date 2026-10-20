'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { courseLecturesApi } from '@/services/api.service';
import type { LectureChapter } from '@/types/lecture.types';

// Every paper's lecture list, e.g. to refresh completion checkmarks
export const ALL_COURSE_LECTURES_QUERY_KEY = ['course-lectures'] as const;

export const COURSE_LECTURES_QUERY_KEY = (paperId: string) =>
  [...ALL_COURSE_LECTURES_QUERY_KEY, { paperId }] as const;

export const useCourseLectures = (paperId: string) => {
  const { data, isLoading, error } = useQuery<LectureChapter[]>({
    queryKey: COURSE_LECTURES_QUERY_KEY(paperId),
    queryFn: async () => {
      const response = await courseLecturesApi(paperId);
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
