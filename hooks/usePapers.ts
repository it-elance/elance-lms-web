import { useQuery } from '@tanstack/react-query';
import { getPapersApi } from '@/services/api.service';

export const usePapers = () => {
  return useQuery({
    queryKey: ['papers'],
    queryFn: getPapersApi,
    staleTime: 1000 * 60 * 10,
  });
};
