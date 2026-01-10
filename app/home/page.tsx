'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for courses
const courses = [
  {
    id: 1,
    title: 'Financial Reporting',
    badge: 'FR',
    chaptersCompleted: 8,
    totalChapters: 12,
    progress: 75,
    thumbnail: '/fr-thumbnail.svg',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    id: 2,
    title: 'Financial Accounting',
    badge: 'FA',
    chaptersCompleted: 8,
    totalChapters: 12,
    progress: 75,
    thumbnail: '/video.png',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: 3,
    title: 'Business Law',
    badge: 'LW',
    chaptersCompleted: 8,
    totalChapters: 12,
    progress: 75,
    thumbnail: '/video.png',
    color: 'bg-mint-100 text-mint-600',
  },
];

// Mock data for announcements
const announcements = [
  {
    id: 1,
    title: 'ACCA EXAM & ACADEMIC UPDATES',
    description:
      'Dear Students, We are pleased to announce that the upcoming exams will handle...',
    tag: 'Academics',
    tagColor: 'bg-(--color-warning-100) text-(--color-warning-600)',
    image: '/video.png',
  },
  {
    id: 2,
    title: 'New Course Materials Available',
    description:
      'Check out the latest study guides and practice exams uploaded to your portal.',
    tag: 'New',
    tagColor: 'bg-(--color-success-100) text-(--color-success-600)',
    image: '/video.png',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-70px)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-2 lg:gap-3 lg:flex-1">
        {/* Left Column: Continue Watching, Quick Actions, My Learning */}
        <div className="lg:col-span-3 space-y-4 lg:border-r-[1.5px] lg:border-(--color-border-light) lg:pr-3 pt-4 lg:pb-4">
          {/* Continue Watching */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-(--color-text-tertiary) Body-Extra-Small">
              Continue Watching
            </h1>

            <div className="bg-(--color-bg-primary) rounded-xl border-[1.5px] border-(--color-border) p-3">
              {/* Video Thumbnail */}
              <div className="relative lg:h-64 h-42 w-full rounded-md overflow-hidden">
                <Image
                  src="/video.png"
                  alt="Course Video"
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button className="flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 lg:px-6 lg:py-2 rounded-full transition-all border border-white/40 cursor-pointer">
                    <Play className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium text-sm lg:text-base">
                      Resume
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-end gap-3">
                  <div>
                    <h1 className="text-(--color-text-primary) Body-Medium mb-1">
                      Straight-line vs Reducing Balance Depreciation
                    </h1>

                    <p className="text-(--color-text-secondary) Body-Extra-Small">
                      Non-Current Assets & Depreciation
                    </p>
                  </div>

                  <span className="shrink-0 bg-(--color-bg-secondary) text-(--color-text-secondary) Overline border border-(--color-border) px-2 rounded pt-1">
                    FA
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-1">
                  <div className="flex justify-between items-center Caption-Small text-(--color-text-tertiary)">
                    <span>Last watched 2 hours ago</span>

                    <span className="flex items-center gap-1">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-2.5 mb-0.5"
                      >
                        <path
                          d="M7 6L5 5V2.5M5 9.5C7.48528 9.5 9.5 7.48528 9.5 5C9.5 2.51472 7.48528 0.5 5 0.5C2.51472 0.5 0.5 2.51472 0.5 5C0.5 7.48528 2.51472 9.5 5 9.5Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>{' '}
                      3 min left
                    </span>
                  </div>

                  <div className="w-full bg-(--color-text-disabled) rounded-full h-1.5">
                    <div
                      className="bg-(--color-success-600) h-1.5 rounded-full"
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* My Learning */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-(--color-text-tertiary) Body-Extra-Small">
              My Learning
            </h1>

            <motion.div
              className="flex items-stretch overflow-x-auto pb-2 lg:pb-0 lg:grid lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 scrollbar-hide"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  className="min-w-[90%] sm:min-w-95 lg:min-w-0 shrink-0 bg-(--color-bg-primary) border-[1.5px] border-(--color-border) rounded-xl p-2 relative"
                >
                  <div className="relative lg:h-24 h-32 w-full rounded-md mb-2 overflow-hidden flex items-center justify-center">
                    {course.thumbnail.endsWith('.svg') ||
                    course.thumbnail.endsWith('.png') ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-4xl text-inherit opacity-20 font-bold">
                        {course.badge}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-(--color-text-primary) Body-Small line-clamp-1">
                        {course.title}
                      </h1>

                      <div className="mt-3 flex flex-col items-start gap-1">
                        <span className="bg-(--color-bg-secondary) text-(--color-text-secondary) Overline border border-(--color-border) px-2 rounded pt-1">
                          {course.badge}
                        </span>

                        <span className="text-(--color-text-tertiary) Overline mt-1 ms-1">
                          {course.chaptersCompleted}/{course.totalChapters}{' '}
                          Chapters
                        </span>
                      </div>
                    </div>

                    {/* Progress Circle */}
                    <div className="relative w-13 h-13 flex items-center justify-center shrink-0 ml-2 mt-3.5">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 40 40"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="transparent"
                          className="text-(--color-bg-tertiary)"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="transparent"
                          strokeDasharray={100.5}
                          strokeDashoffset={
                            100.5 - (100.5 * course.progress) / 100
                          }
                          strokeLinecap="round"
                          className="text-(--color-success-600)"
                        />
                      </svg>

                      <span className="absolute Caption-Small text-(--color-text-tertiary)">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="min-w-35 lg:min-w-0 shrink-0 flex items-center justify-center"
              >
                <Link
                  href="/learning"
                  className="flex items-center gap-1 cursor-pointer whitespace-nowrap px-4"
                >
                  <span className="text-(--color-primary-500) Button-Small">
                    More Courses
                  </span>

                  <div className="text-(--color-primary-500) transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Announcements */}
        <motion.div
          className="space-y-2 lg:py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-(--color-text-tertiary) Body-Extra-Small">
            Announcements
          </h2>

          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-(--color-bg-primary) rounded-xl border-[1.5px] border-(--color-border) p-2 lg:p-3 flex lg:block gap-2 lg:gap-3"
              >
                <div className="relative w-28 lg:w-full lg:h-30 rounded-lg overflow-hidden shrink-0 lg:mb-2">
                  <Image
                    src={announcement.image}
                    alt={announcement.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1 lg:space-y-2">
                  <span
                    className={`inline-block ${announcement.tagColor} Caption-Small px-2 py-0.5 rounded`}
                  >
                    {announcement.tag}
                  </span>

                  <h3 className="text-(--color-text-primary) Body-Small line-clamp-1 lg:line-clamp-2">
                    {announcement.title}
                  </h3>

                  <p className="text-(--color-text-tertiary) Body-Extra-Small line-clamp-2">
                    {announcement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
