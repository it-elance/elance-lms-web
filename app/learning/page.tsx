'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: number;
  title: string;
  code: string;
  totalChapters: number;
  completedChapters: number;
  progress: number;
}

// Mock Data
const courses: Course[] = [
  {
    id: 1,
    title: 'Financial Reporting',
    code: 'FR',
    totalChapters: 12,
    completedChapters: 8,
    progress: 100,
  },
  {
    id: 2,
    title: 'Financial Accounting',
    code: 'FA',
    totalChapters: 12,
    completedChapters: 8,
    progress: 10,
  },
  {
    id: 3,
    title: 'Business Law',
    code: 'LW',
    totalChapters: 12,
    completedChapters: 8,
    progress: 90,
  },
  {
    id: 4,
    title: 'Business Law',
    code: 'LW',
    totalChapters: 12,
    completedChapters: 8,
    progress: 80,
  },
  {
    id: 5,
    title: 'Financial Reporting',
    code: 'FR',
    totalChapters: 12,
    completedChapters: 8,
    progress: 50,
  },
  {
    id: 6,
    title: 'Financial Accounting',
    code: 'FA',
    totalChapters: 12,
    completedChapters: 8,
    progress: 40,
  },
  {
    id: 7,
    title: 'Business Law',
    code: 'LW',
    totalChapters: 12,
    completedChapters: 8,
    progress: 30,
  },
  {
    id: 8,
    title: 'Business Law',
    code: 'LW',
    totalChapters: 12,
    completedChapters: 8,
    progress: 26,
  },
];

const MotionLink = motion.create(Link);

const Learning = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {courses.map((course, index) => (
        <MotionLink
          key={index}
          href="/learning/videos"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          className="block border border-(--color-border) rounded-xl p-3 group cursor-pointer"
        >
          {/* Course Thumbnail */}
          <div className="relative h-32 w-full rounded overflow-hidden">
            <Image
              src="/fr-thumbnail.svg"
              alt={course.title}
              fill
              className="object-cover"
              priority={index < 4}
            />
          </div>

          {/* Content */}
          <div className="pt-2 relative">
            {/* Course Title */}
            <h3 className="Body-Small text-(--color-text-primary) mb-2 truncate">
              {course.title}
            </h3>

            {/* Course Code & Chapters */}
            <div className="flex items-end justify-between pt-3">
              <div className="flex flex-col gap-2">
                {/* Course Code */}
                <span className="w-fit px-2 pt-0.5 Overline rounded border border-(--color-border-strong) text-(--color-text-secondary) uppercase bg-(--color-bg-secondary)">
                  {course.code}
                </span>

                {/* Course Chapters */}
                <span className="Caption-Small text-(--color-text-tertiary)">
                  <span className="Overline">{course.completedChapters}</span>/
                  {course.totalChapters} Chapters
                </span>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="absolute right-0 top-[57%] -translate-y-1/2 w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="var(--color-bg-tertiary)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="var(--color-success-600)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="138.2"
                  strokeDashoffset={138.2 - (138.2 * course.progress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <span className="absolute Caption-Small text-(--color-text-tertiary)">
                {course.progress}%
              </span>
            </div>
          </div>
        </MotionLink>
      ))}
    </div>
  );
};

export default Learning;
