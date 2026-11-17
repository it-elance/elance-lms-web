import { useQuery } from '@tanstack/react-query';
import { paperDetailsApi } from '@/services/api.service';
import type { PaperDetailsData } from '@/types/lecture.types';

// Every paper's details, e.g. to refresh the completed chapters count
export const ALL_PAPER_DETAILS_QUERY_KEY = ['paper-details'] as const;

// A paper's details: over all the student's batches of it, or batchId alone
export const usePaperDetails = (paperId: string, batchId?: string | null) => {
  const { data, isLoading, error } = useQuery<PaperDetailsData>({
    queryKey: [...ALL_PAPER_DETAILS_QUERY_KEY, paperId, batchId ?? ''],
    queryFn: () => paperDetailsApi(paperId, batchId),
    enabled: !!paperId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    paperDetails: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
