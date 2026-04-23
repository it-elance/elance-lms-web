'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHomeData } from '@/hooks/useHomeData';

const CourseCardSkeleton = () => (
  <div className="min-w-[90%] sm:min-w-95 lg:min-w-0 shrink-0 bg-(--color-bg-primary) border-[1.5px] border-(--color-border) rounded-xl p-2 animate-pulse">
    <div className="h-32 w-full rounded-md mb-2 bg-(--color-bg-tertiary)" />
    <div className="h-4 bg-(--color-bg-tertiary) rounded w-3/4 mb-2" />
    <div className="h-3 bg-(--color-bg-tertiary) rounded w-1/2" />
  </div>
);

const Home = () => {
  const { data, isLoading } = useHomeData();

  const continueWatching = data?.continue_watching;
  const hasContinueWatching =
    continueWatching?.lecture_id && continueWatching.lecture_id !== '';

  const myLearning = data?.my_learning ?? [];
  const announcements = data?.announcements ?? [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-70px)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-2 lg:gap-3 lg:flex-1">
        {/* Left Column: Continue Watching, My Learning */}
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
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="lg:h-64 h-42 w-full rounded-md bg-(--color-bg-tertiary)" />
                  <div className="mt-3 h-5 bg-(--color-bg-tertiary) rounded w-2/3" />
                  <div className="mt-2 h-3 bg-(--color-bg-tertiary) rounded w-1/3" />
                </div>
              ) : hasContinueWatching ? (
                <>
                  {/* Video Thumbnail */}
                  <div className="relative lg:h-64 h-42 w-full rounded-md overflow-hidden">
                    {continueWatching?.thumbnail_url ? (
                      <Image
                        src={continueWatching?.thumbnail_url}
                        alt={continueWatching?.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-(--color-bg-tertiary) flex items-center justify-center">
                        <Play className="w-12 h-12 text-(--color-text-disabled)" />
                      </div>
                    )}

                    {/* Resume Button */}
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
                          {continueWatching?.title}
                        </h1>

                        <p className="text-(--color-text-secondary) Body-Extra-Small">
                          {continueWatching?.subject}
                        </p>
                      </div>

                      {continueWatching?.paper_code && (
                        <span className="shrink-0 bg-(--color-bg-secondary) text-(--color-text-secondary) Overline border border-(--color-border) px-2 rounded pt-1">
                          {continueWatching?.paper_code}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-col gap-1">
                      <div className="flex justify-between items-center Caption-Small text-(--color-text-tertiary)">
                        <span>{continueWatching?.last_watched_label}</span>

                        {continueWatching?.remaining_time_label !== null && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.ceil(
                              continueWatching?.remaining_time_label / 60
                            )}{' '}
                            min remaining
                          </span>
                        )}
                      </div>

                      {continueWatching?.progress_percent !== null && (
                        <div className="w-full bg-(--color-text-disabled) rounded-full h-1.5">
                          <div
                            className="bg-(--color-success-600) h-1.5 rounded-full"
                            style={{
                              width: `${continueWatching?.progress_percent}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Empty state */
                <div className="lg:h-40 h-32 flex flex-col items-center justify-center gap-2">
                  <Play className="w-10 h-10 text-(--color-text-disabled)" />

                  <p className="text-(--color-text-tertiary) Body-Small">
                    No lectures in progress yet
                  </p>

                  <Link
                    href="/learning"
                    className="text-(--color-primary-500) Button-Small mt-1"
                  >
                    Start Learning →
                  </Link>
                </div>
              )}
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

            <div className="flex items-stretch overflow-x-auto pb-2 lg:pb-0 lg:grid lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 scrollbar-hide">
              {isLoading ? (
                <>
                  <CourseCardSkeleton />
                  <CourseCardSkeleton />
                </>
              ) : myLearning.length > 0 ? (
                myLearning.map((course, index) => (
                  <motion.div
                    key={course?.subject_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeOut',
                      delay: index * 0.1,
                    }}
                    className="min-w-[90%] sm:min-w-95 lg:min-w-0 shrink-0 bg-(--color-bg-primary) border-[1.5px] border-(--color-border) rounded-xl p-2 relative"
                  >
                    <div className="relative h-32 w-full rounded-md mb-2 overflow-hidden flex items-center justify-center">
                      {course?.image_url ? (
                        <Image
                          src={course?.image_url}
                          alt={course?.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="text-4xl text-(--color-text-disabled) opacity-20 font-bold">
                          {course?.paper_code}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-(--color-text-primary) Body-Small line-clamp-1">
                          {course?.title}
                        </h1>

                        <div className="mt-3 flex flex-col items-start gap-1">
                          <span className="bg-(--color-bg-secondary) text-(--color-text-secondary) Overline border border-(--color-border) px-2 rounded pt-1">
                            {course?.paper_code}
                          </span>

                          <span className="text-(--color-text-tertiary) Overline mt-1 ms-1">
                            {course?.completed_chapters}/
                            {course?.total_chapters} Chapters
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
                              100.5 -
                              (100.5 * course?.progress_percentage) / 100
                            }
                            strokeLinecap="round"
                            className="text-(--color-success-600)"
                          />
                        </svg>

                        <span className="absolute Caption-Small text-(--color-text-tertiary)">
                          {course?.progress_percentage}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 flex items-center justify-center h-24 text-(--color-text-tertiary) Body-Small">
                  No subjects enrolled yet.
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: myLearning.length * 0.1,
                }}
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
            </div>
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
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-(--color-bg-primary) rounded-xl border-[1.5px] border-(--color-border) p-3 h-32"
                  >
                    <div className="w-full h-16 bg-(--color-bg-tertiary) rounded-lg mb-2" />
                    <div className="h-3 bg-(--color-bg-tertiary) rounded w-full" />
                  </div>
                ))}
              </div>
            ) : announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement?.announcement_id}
                  className="bg-(--color-bg-primary) rounded-xl border-[1.5px] border-(--color-border) p-2 lg:p-3 flex lg:block gap-2 lg:gap-3"
                >
                  {announcement?.image_url ? (
                    <div className="relative w-28 lg:w-full lg:h-30 rounded-lg overflow-hidden shrink-0 lg:mb-2">
                      <Image
                        src={announcement?.image_url}
                        alt={announcement?.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-28 lg:w-full lg:h-20 rounded-lg bg-(--color-bg-tertiary) shrink-0 lg:mb-2 flex items-center justify-center">
                      <span className="text-(--color-text-disabled) text-xs">
                        {announcement?.category}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1 lg:space-y-2">
                    <span className="inline-block bg-(--color-warning-100) text-(--color-warning-600) Caption-Small px-2 py-0.5 rounded">
                      {announcement?.category}
                    </span>

                    <h3 className="text-(--color-text-primary) Body-Small line-clamp-1 lg:line-clamp-2">
                      {announcement?.title}
                    </h3>

                    <p className="text-(--color-text-tertiary) Body-Extra-Small line-clamp-2">
                      {announcement?.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-(--color-text-tertiary) Body-Extra-Small text-center py-6">
                No announcements yet.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
