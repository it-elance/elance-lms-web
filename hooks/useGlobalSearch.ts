'use client';

import { useQuery } from '@tanstack/react-query';
import { globalSearchApi } from '@/services/api.service';
import { useDebounce } from './useDebounce';

export const useGlobalSearch = (query: string) => {
  const debouncedQuery = useDebounce(query.trim(), 500);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: () => globalSearchApi(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    debouncedQuery,
  };
};
