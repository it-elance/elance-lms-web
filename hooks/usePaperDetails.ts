import { useQuery } from '@tanstack/react-query';
import { paperDetailsApi } from '@/services/api.service';
import type { PaperDetailsData } from '@/types/lecture.types';

// Every paper's details, e.g. to refresh the completed chapters count
export const ALL_PAPER_DETAILS_QUERY_KEY = ['paper-details'] as const;

export const usePaperDetails = (paperId: string) => {
  const { data, isLoading, error } = useQuery<PaperDetailsData>({
    queryKey: [...ALL_PAPER_DETAILS_QUERY_KEY, paperId],
    queryFn: () => paperDetailsApi(paperId),
    enabled: !!paperId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    paperDetails: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
