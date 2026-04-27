import { useQuery } from '@tanstack/react-query';
import { paperDetailsApi } from '@/services/api.service';
import type { PaperDetailsData } from '@/types/lecture.types';

export const usePaperDetails = (paperId: string) => {
  const { data, isLoading, error } = useQuery<PaperDetailsData>({
    queryKey: ['paper-details', paperId],
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
