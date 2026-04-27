'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { lectureVideoApi } from '@/services/api.service';
import type { LectureVideoData } from '@/types/lecture.types';

export const useLectureVideo = (lectureId: string | null | undefined) => {
  const actualLectureId = useMemo(() => {
    if (!lectureId) return null;

    return lectureId.includes('-') ? lectureId.split('-').pop()! : lectureId;
  }, [lectureId]);

  const { data, isLoading, error } = useQuery<LectureVideoData>({
    queryKey: ['lecture-video', actualLectureId],
    queryFn: () => lectureVideoApi(actualLectureId!),
    enabled: !!actualLectureId,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  return {
    videoData: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
