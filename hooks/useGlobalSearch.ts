'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { globalSearchApi } from '@/services/api.service';
import { useDebounce } from './useDebounce';

export const SEARCH_PAGE_SIZE = 10;

// Search results a page at a time; fetchNextPage loads the next one onto the end
export const useGlobalSearch = (query: string) => {
  const debouncedQuery = useDebounce(query.trim(), 500);

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: ({ pageParam }) =>
      globalSearchApi(debouncedQuery, pageParam, SEARCH_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next
        ? lastPage.pagination.current_page + 1
        : undefined,
    enabled: debouncedQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data: data?.pages.flatMap((page) => page.topics),
    totalItems: data?.pages[0]?.pagination.total_items,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    debouncedQuery,
  };
};
