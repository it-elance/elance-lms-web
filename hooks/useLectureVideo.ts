'use client';

import { useQuery } from '@tanstack/react-query';
import { lectureVideoApi } from '@/services/api.service';
import type { LectureVideoData } from '@/types/lecture.types';

export const useLectureVideo = (lectureId: string | null | undefined) => {
  const { data, isLoading, error } = useQuery<LectureVideoData>({
    queryKey: ['lecture-video', lectureId],
    queryFn: () => lectureVideoApi(lectureId!),
    enabled: !!lectureId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    videoData: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
