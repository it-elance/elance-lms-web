'use client';

import { useQuery } from '@tanstack/react-query';
import { lectureVideoApi } from '@/services/api.service';
import { batchLockOf } from '@/services/apiClient';
import type { LectureVideoData } from '@/types/lecture.types';

export const useLectureVideo = (lectureId: string | null | undefined) => {
  const { data, isLoading, error } = useQuery<LectureVideoData>({
    queryKey: ['lecture-video', lectureId],
    queryFn: () => lectureVideoApi(lectureId!),
    enabled: !!lectureId,
    // The access token is single-use: once the player has loaded it, TPStreams rejects it
    // (404 + X-Frame-Options: DENY, which shows a broken frame). So keep it only while this
    // lecture is on screen, never refetch it in the background (that would reload the
    // player mid-video), and drop it on leave so coming back always gets a fresh token.
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // A locked batch (completed, or the student is inactive in it) stays locked, so asking again
    // is pointless
    retry: (failureCount, err) => !batchLockOf(err) && failureCount < 1,
  });

  return {
    videoData: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    batchLock: batchLockOf(error),
  };
};
