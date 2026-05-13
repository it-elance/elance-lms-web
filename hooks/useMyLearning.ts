'use client';

import { useState, useEffect } from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { myLearningApi } from '@/services/api.service';
import type { Subject } from '@/types/learning.types';
import type { Pagination } from '@/types/common.types';

export const MY_LEARNING_QUERY_KEY = (page: number) =>
  ['my-learning', page] as const;

export const useMyLearning = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: MY_LEARNING_QUERY_KEY(page),
    queryFn: () => myLearningApi(page),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const subjects: Subject[] = data?.subjects ?? [];
  const pagination: Pagination | null = data?.pagination ?? null;

  useEffect(() => {
    if (pagination?.has_next) {
      queryClient.prefetchQuery({
        queryKey: MY_LEARNING_QUERY_KEY(page + 1),
        queryFn: () => myLearningApi(page + 1),
      });
    }
  }, [page, pagination, queryClient]);

  return {
    subjects,
    pagination,
    isLoading,
    error: error instanceof Error ? error.message : null,
    page,
    setPage,
    refetch,
  };
};
