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
    <div className="flex flex-col min-h-full w-full relative lg:justify-center">
      <div className="sticky top-0 z-10 w-full flex justify-start pointer-events-none bg-(--color-bg-primary) py-4 lg:absolute lg:top-0 lg:left-0">
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
                {admission?.is_primary && (
                  <div className="absolute top-0 right-0 bg-(--color-primary-500) text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    PRIMARY
                  </div>
                )}

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

                {/* Batch */}
                <div className="flex flex-row justify-between items-center py-3">
                  <span className="text-(--color-text-tertiary) Body-Small">
                    Batch
                  </span>

                  <div className="flex flex-col items-end">
                    {admission.batch?.map((b) => (
                      <span
                        key={b?.batch_id}
                        className="text-(--color-text-primary) Body-Small text-right"
                      >
                        {b?.label}
                      </span>
                    ))}
                  </div>
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
                    className={`px-3 py-1 Caption-Small ${
                      admission?.enrollment_status?.code === 'active'
                        ? 'text-(--color-success-600)'
                        : 'text-(--color-text-secondary)'
                    }`}
                  >
                    {admission?.enrollment_status?.label}
                  </span>
                </div>

                <div className="border-b border-(--color-border-light)" />

                {/* Course Validity */}
                <div className="flex flex-row justify-between items-center py-3">
                  <span className="text-(--color-text-tertiary) Body-Small">
                    Course validity
                  </span>

                  <span className="text-(--color-text-primary) Body-Small text-right capitalize">
                    {admission?.course_validity?.value}{' '}
                    {admission?.course_validity?.unit}
                  </span>
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
