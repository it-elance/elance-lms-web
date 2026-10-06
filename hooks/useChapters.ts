import { useQuery } from '@tanstack/react-query';
import { getChaptersApi } from '@/services/api.service';

// Chapters of these papers, or of all the student's papers when none are selected
export const useChapters = (paperIds: string[], enabled: boolean) => {
  return useQuery({
    queryKey: ['chapters', paperIds],
    queryFn: () => getChaptersApi(paperIds),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
};
