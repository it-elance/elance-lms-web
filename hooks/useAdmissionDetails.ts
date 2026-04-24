import { useQuery } from '@tanstack/react-query';
import { admissionDetailsApi } from '@/services/api.service';
import type { AdmissionDetailsData } from '@/types/admission.types';

export const useAdmissionDetails = () => {
  const { data, isLoading, error } = useQuery<AdmissionDetailsData>({
    queryKey: ['admission-details'],
    queryFn: admissionDetailsApi,
    staleTime: 1000 * 60 * 5,
  });

  return {
    admissions: data?.admissions ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
