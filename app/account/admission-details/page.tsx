'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AdmissionDetails = () => {
  const router = useRouter();
  const details = [
    { label: 'Admissions ID', value: 'ELC120976V2025' },
    { label: 'Program Enrolled', value: 'ACCA Prime Plus' },
    { label: 'Batch', value: 'March 2025 to Dec 2025' },
    { label: 'Enrollment Type', value: 'Offline' },
    { label: 'Admission date', value: '15 March 2026' },
  ];

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

        <div className="flex items-center justify-center relative w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="Heading-3 text-(--color-text-primary)"
          >
            Admissions Details
          </motion.h1>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto mt-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-(--color-bg-secondary) rounded-xl p-5 flex flex-col"
        >
          {details.map((item) => (
            <div key={item.label}>
              <div className="flex flex-row justify-between items-center py-3">
                <span className="text-(--color-text-tertiary) Body-Small">
                  {item.label}
                </span>

                <span className="text-(--color-text-primary) Body-Small text-right">
                  {item.value}
                </span>
              </div>

              <div className="border-b border-(--color-border-light)" />
            </div>
          ))}

          <div className="flex flex-row justify-between items-center py-3">
            <span className="text-(--color-text-tertiary) Body-Small">
              Enrollment status
            </span>

            <span className="px-3 py-1 text-(--color-success-600) Caption-Small">
              Active
            </span>
          </div>

          <div className="border-b border-(--color-border-light)" />

          <div className="flex flex-row justify-between items-center py-3">
            <span className="text-(--color-text-tertiary) Body-Small">
              Course validity
            </span>

            <span className="text-(--color-text-primary) Body-Small text-right">
              24 Months
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdmissionDetails;
