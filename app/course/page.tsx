'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const courses = [
  {
    id: 'acca',
    title: 'ACCA',
    description: 'Association of Chartered Certified Accountants',
  },
  {
    id: 'cma',
    title: 'CMA',
    description: 'Cost & Management Accounting',
  },
  {
    id: 'ca',
    title: 'CA',
    description: 'Chartered Accountancy',
  },
];

const Course = () => {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState('acca');

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
            {courses.map((course) => {
              const isSelected = selectedCourse === course.id;
              return (
                <motion.div
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'border-(--color-primary-500) bg-(--color-info-100)'
                      : 'border-(--color-border-medium) bg-(--color-bg-primary)'
                  }`}
                >
                  <div className="pr-4">
                    <h3 className="text-(--color-text-primary) mb-1 Button-Primary">
                      {course.title}
                    </h3>

                    <p className="text-sm text-(--color-text-secondary) Body-Extra-Small">
                      {course.description}
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
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Course;
