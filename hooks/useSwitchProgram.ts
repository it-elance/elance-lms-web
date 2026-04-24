'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { switchProgramApi } from '@/services/api.service';
import { HOME_QUERY_KEY } from '@/hooks/useHomeData';
import toast from 'react-hot-toast';

export const useSwitchProgram = (currentSelectedId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: switchProgram, isPending } = useMutation({
    mutationFn: (programId: string) => switchProgramApi(programId),
    onSuccess: () => {
      toast.success('Program switched successfully');
      queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['admission-details'] });
      router.push('/home');
    },
    onError: () => {
      toast.error('Failed to switch program');
    },
  });

  const handleSelect = (programId: string) => {
    if (isPending) return;
    if (programId === currentSelectedId) {
      router.back();
      return;
    }
    switchProgram(programId);
  };

  return { handleSelect, isPending };
};
