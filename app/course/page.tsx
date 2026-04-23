'use client';

import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useHomeData } from '@/hooks/useHomeData';
import { useSwitchProgram } from '@/hooks/useSwitchProgram';

const Course = () => {
  const router = useRouter();
  const { data, isLoading } = useHomeData();

  const availablePrograms = data?.available_programs ?? [];
  const currentSelectedId =
    availablePrograms.find((p) => p.is_selected)?.program_id ?? '';

  const { handleSelect, isPending } = useSwitchProgram(currentSelectedId);

  return (
    <motion.div
      className="min-h-full bg-(--color-bg-primary) relative flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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

      <div className="flex-1 flex items-center justify-center -mt-4">
        <div className="w-full max-w-xl">
          <motion.h1
            className="Heading-3 text-(--color-text-primary) mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            What do you want to learn today?
          </motion.h1>

          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-(--color-bg-tertiary) rounded-xl"
                  />
                ))}
              </div>
            ) : (
              availablePrograms.map((program) => {
                const isSelected = currentSelectedId === program?.program_id;

                return (
                  <motion.div
                    key={program?.program_id}
                    onClick={() => handleSelect(program?.program_id ?? '')}
                    className={`relative p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                      isPending
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer'
                    } ${
                      isSelected
                        ? 'border-(--color-primary-500) bg-(--color-info-100)'
                        : 'border-(--color-border-medium) bg-(--color-bg-primary)'
                    }`}
                    whileTap={isPending ? {} : { scale: 0.99 }}
                  >
                    <div className="pr-4">
                      <h3 className="text-(--color-text-primary) mb-1 Button-Primary">
                        {program?.name}
                      </h3>

                      <p className="text-sm text-(--color-text-secondary) Body-Extra-Small">
                        {program?.code}
                      </p>
                    </div>

                    {/* Radio Button */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-(--color-primary-500) bg-(--color-bg-primary)'
                          : 'border-(--color-border-strong)'
                      }`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            className="w-3 h-3 rounded-full bg-(--color-primary-500)"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 15,
                            }}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Course;
