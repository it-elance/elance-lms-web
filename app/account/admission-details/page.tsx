'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdmissionDetails } from '@/hooks/useAdmissionDetails';
import type { Admission } from '@/types/admission.types';

const AdmissionDetails = () => {
  const router = useRouter();
  const { admissions, isLoading } = useAdmissionDetails();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col min-h-full w-full relative">
      <div className="sticky top-0 z-10 w-full flex justify-start pointer-events-none bg-(--color-bg-primary) py-4">
        <motion.button
          onClick={() => router.back()}
          className="rounded-full transition-colors pointer-events-auto cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ChevronLeft className="w-6 h-6 text-(--color-text-primary)" />
        </motion.button>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 pb-6 mt-3">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-(--color-bg-secondary) rounded-xl p-5 flex flex-col space-y-4"
          >
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="flex justify-between items-center py-3">
                <div className="h-4 bg-(--color-bg-tertiary) rounded w-24"></div>
                <div className="h-4 bg-(--color-bg-tertiary) rounded w-32"></div>
              </div>

              <div className="border-b border-(--color-border-light)" />

              <div className="flex justify-between items-center py-3">
                <div className="h-4 bg-(--color-bg-tertiary) rounded w-28"></div>
                <div className="h-4 bg-(--color-bg-tertiary) rounded w-24"></div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {admissions?.map((admission: Admission) => (
              <motion.div
                key={admission?.admission_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-(--color-bg-secondary) rounded-xl p-5 flex flex-col relative overflow-hidden"
              >
                {/* Admission ID */}
                <div className="flex flex-row justify-between items-center py-3">
                  <span className="text-(--color-text-tertiary) Body-Small">
                    Admissions ID
                  </span>

                  <span className="text-(--color-text-primary) Body-Small text-right">
                    {admission?.admission_id}
                  </span>
                </div>

                <div className="border-b border-(--color-border-light)" />

                {/* Program Enrolled */}
                <div className="flex flex-row justify-between items-center py-3">
                  <span className="text-(--color-text-tertiary) Body-Small">
                    Program Enrolled
                  </span>

                  <span className="text-(--color-text-primary) Body-Small text-right">
                    {admission?.program?.name}
                  </span>
                </div>

                <div className="border-b border-(--color-border-light)" />

                {/* Enrollment Type */}
                <div className="flex flex-row justify-between items-center py-3">
                  <span className="text-(--color-text-tertiary) Body-Small">
                    Enrollment Type
                  </span>

                  <span className="text-(--color-text-primary) Body-Small text-right capitalize">
                    {admission?.enrollment_type}
                  </span>
                </div>

                <div className="border-b border-(--color-border-light)" />

                {/* Admission Date */}
                <div className="flex flex-row justify-between items-center py-3">
                  <span className="text-(--color-text-tertiary) Body-Small">
                    Admission date
                  </span>

                  <span className="text-(--color-text-primary) Body-Small text-right">
                    {formatDate(admission?.admission_date)}
                  </span>
                </div>

                <div className="border-b border-(--color-border-light)" />

                {/* Enrollment Status */}
                <div className="flex flex-row justify-between items-center py-3">
                  <span className="text-(--color-text-tertiary) Body-Small">
                    Enrollment status
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-xs border ${
                      admission?.enrollment_status?.code === 'active'
                        ? 'text-(--color-success-600) border-(--color-success-600)/20 bg-(--color-success-600)/1'
                        : 'text-(--color-text-secondary) border-(--color-text-secondary)/20 bg-(--color-text-secondary)/1'
                    }`}
                  >
                    {admission?.enrollment_status?.label}
                  </span>
                </div>

                <div className="border-b border-(--color-border-light)" />

                {/* Batch */}
                <div className="flex flex-col py-3">
                  <div className="flex flex-row justify-between items-center mb-4">
                    <span className="text-(--color-text-tertiary) Caption Small">
                      Batch
                    </span>

                    <span className="text-(--color-text-tertiary) Body-Small">
                      {admission?.batch?.length || 0} enrolled
                    </span>
                  </div>

                  <div className="flex flex-col space-y-4">
                    {admission?.batch?.map((b) => {
                      const parts = b?.label?.split('-');
                      const subjectCode =
                        parts && parts.length > 0
                          ? parts[parts.length - 1]
                          : '';

                      return (
                        <div
                          key={b?.batch_id}
                          className="flex flex-row justify-between items-center"
                        >
                          <div className="flex flex-row items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-(--color-bg-tertiary) flex items-center justify-center">
                              <SvgIcon
                                src="/school.svg"
                                className="w-5 h-4 bg-(--color-text-secondary)"
                              />
                            </div>

                            <span className="text-(--color-text-primary) Body-Small">
                              {b?.label}
                            </span>
                          </div>

                          {subjectCode && (
                            <span className="px-2 py-1 rounded border border-(--color-border-light) text-(--color-text-primary) font-medium Caption-Small">
                              {subjectCode}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionDetails;

const SvgIcon = ({
  src,
  className = '',
}: {
  src: string;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
);
