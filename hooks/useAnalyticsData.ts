'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnalyticsApi } from '@/services/api.service';
import type { AnalyticsData } from '@/types/analytics.types';

export const ANALYTICS_QUERY_KEY = ['analytics-data'] as const;

export const useAnalyticsData = () => {
  const { data, isLoading, error, refetch } = useQuery<AnalyticsData>({
    queryKey: ANALYTICS_QUERY_KEY,
    queryFn: getAnalyticsApi,
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};
