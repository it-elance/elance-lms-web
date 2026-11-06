'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getVerificationApi,
  sendVerificationCodeApi,
  verifyVerificationCodeApi,
} from '@/services/api.service';
import type { ContactVerification } from '@/types/auth.types';

// Contact verification at signup: after their first login a student verifies
// the contact they didn't log in with before using the app
export const CONTACT_VERIFICATION_QUERY_KEY = ['contact-verification'] as const;

export const useContactVerification = (enabled: boolean) => {
  const queryClient = useQueryClient();

  const { data } = useQuery<ContactVerification>({
    queryKey: CONTACT_VERIFICATION_QUERY_KEY,
    queryFn: getVerificationApi,
    enabled,
    // Only a code changes it, and the verify call returns the new status
    staleTime: Infinity,
  });

  const sendCode = useMutation({ mutationFn: sendVerificationCodeApi });

  const verifyCode = useMutation({
    mutationFn: verifyVerificationCodeApi,
    onSuccess: (verification) => {
      queryClient.setQueryData(CONTACT_VERIFICATION_QUERY_KEY, verification);
    },
  });

  return { verification: data, sendCode, verifyCode };
};
