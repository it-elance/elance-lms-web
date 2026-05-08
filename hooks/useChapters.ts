import { useQuery } from '@tanstack/react-query';
import { getChaptersApi } from '@/services/api.service';

export const useChapters = (paperId?: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ['chapters', paperId],
    queryFn: () => getChaptersApi(paperId!),
    enabled: !!paperId && enabled,
    staleTime: 1000 * 60 * 10,
  });
};
