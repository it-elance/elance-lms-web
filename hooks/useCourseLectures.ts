'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { courseLecturesApi } from '@/services/api.service';
import type { LectureChapter } from '@/types/lecture.types';

export const COURSE_LECTURES_QUERY_KEY = (paperId: string) =>
  ['course-lectures', { paperId }] as const;

export const useCourseLectures = (paperId: string) => {
  const { data, isLoading, error } = useQuery<LectureChapter[]>({
    queryKey: COURSE_LECTURES_QUERY_KEY(paperId),
    queryFn: async () => {
      const response = await courseLecturesApi(paperId);
      return response.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
    enabled: !!paperId,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  return {
    chapters: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
