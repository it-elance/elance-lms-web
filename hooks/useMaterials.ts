'use client';

import { useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { materialsByLectureApi } from '@/services/api.service';
import type { Material } from '@/types/material.types';

export const MATERIALS_QUERY_KEY = (lectureId: string) =>
  ['lecture-materials', lectureId] as const;

export const useMaterials = (lectureId: string | null | undefined) => {
  const actualLectureId = useMemo(() => {
    if (!lectureId) return null;
    const id = String(lectureId);
    return id.includes('-') ? id.split('-').pop()! : id;
  }, [lectureId]);

  const { data, isLoading, error } = useQuery<Material[]>({
    queryKey: ['lecture-materials', actualLectureId],
    queryFn: () => materialsByLectureApi(actualLectureId!),
    enabled: !!actualLectureId,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  return {
    materials: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
