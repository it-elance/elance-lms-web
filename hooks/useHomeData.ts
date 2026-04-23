'use client';

import { useQuery } from '@tanstack/react-query';
import { homeApi } from '@/services/api.service';
import type { HomeData } from '@/types/home.types';

export const HOME_QUERY_KEY = ['home-data'] as const;

export const useHomeData = () => {
  const { data, isLoading, error, refetch } = useQuery<HomeData>({
    queryKey: HOME_QUERY_KEY,
    queryFn: homeApi,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};
