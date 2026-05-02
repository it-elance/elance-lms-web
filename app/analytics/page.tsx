'use client';

import { motion } from 'framer-motion';
import { Play, ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import Image from 'next/image';
const AnalyticsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showHeader = searchParams.get('showHeader') === 'true';

  const { data, isLoading } = useAnalyticsData();

  return (
    <div className="flex flex-col min-h-full w-full relative">
      {showHeader && (
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
      )}

      {isLoading || !data ? (
        <div className="w-full pb-6 mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Left Column Skeleton */}
          <div className="space-y-3">
            {/* Progress Card Skeleton */}
            <div className="bg-(--color-bg-hover) rounded-xl p-5 animate-pulse">
              <div className="h-6 w-1/2 bg-(--color-bg-tertiary) rounded mb-6" />

              <div className="flex flex-col items-center mb-8">
                <div className="w-28 h-28 rounded-full bg-(--color-bg-tertiary) mb-3" />
                <div className="h-4 w-32 bg-(--color-bg-tertiary) rounded mt-3" />
              </div>

              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-(--color-bg-tertiary) rounded mb-2" />
                <div className="h-4 w-5/6 bg-(--color-bg-tertiary) rounded mb-2" />
                <div className="h-4 w-2/3 bg-(--color-bg-tertiary) rounded" />

                <div className="pt-4 flex justify-between items-end">
                  <div className="h-3 w-32 bg-(--color-bg-tertiary) rounded" />
                </div>
              </div>
            </div>

            {/* Videos Completed Skeleton */}
            <div className="bg-(--color-bg-hover) rounded-xl p-5 flex justify-between items-center animate-pulse">
              <div className="h-4 w-32 bg-(--color-bg-tertiary) rounded" />
              <div className="h-6 w-16 bg-(--color-bg-tertiary) rounded" />
            </div>

            {/* Weekly Stats Skeleton */}
            <div className="bg-(--color-bg-hover) rounded-xl p-5 flex flex-col items-center text-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-(--color-bg-tertiary) mb-4" />
              <div className="flex flex-col gap-2 items-center w-full">
                <div className="h-4 w-48 bg-(--color-bg-tertiary) rounded" />
                <div className="h-4 w-56 bg-(--color-bg-tertiary) rounded" />
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-3">
            {/* Watch Time Chart Skeleton */}
            <div className="h-4 w-40 bg-(--color-bg-tertiary) rounded mb-3 animate-pulse" />

            <div className="border border-(--color-border-medium) rounded-xl p-5 animate-pulse">
              <div className="flex justify-between">
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="h-3 w-20 bg-(--color-bg-tertiary) rounded mb-2" />
                    <div className="h-8 w-24 bg-(--color-bg-tertiary) rounded" />
                  </div>

                  <div className="h-3 w-28 bg-(--color-bg-tertiary) rounded mt-4" />
                </div>

                <div className="flex items-end gap-2 pb-1 border border-(--color-border-light) rounded-md px-3 pt-4 h-24 w-48">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="w-3 bg-(--color-bg-tertiary) rounded-t-sm h-full"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recently Watched Skeleton */}
            <div className="mt-4 animate-pulse">
              <div className="h-4 w-48 bg-(--color-bg-tertiary) rounded mb-3" />
            </div>

            <div className="border border-(--color-border-medium) rounded-xl overflow-hidden p-3 animate-pulse">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-(--color-bg-secondary) rounded-xl"
                  >
                    <div className="w-22 h-14 rounded-md bg-(--color-bg-tertiary) shrink-0" />

                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-(--color-bg-tertiary) rounded" />
                    </div>

                    <div className="h-3 w-12 bg-(--color-bg-tertiary) rounded me-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full pb-6 mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-(--color-bg-hover) rounded-xl p-5"
            >
              <h2 className="Heading-4 text-(--color-text-primary) mb-6">
                {data?.course?.title}
              </h2>

              <div className="flex flex-col items-center mb-8">
                <div className="relative w-28 h-28">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="var(--color-bg-tertiary)"
                      strokeWidth="12"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="var(--color-success-600)"
                      strokeWidth="12"
                      strokeDasharray="339.292"
                      strokeDashoffset={
                        339.292 *
                        (1 -
                          (data?.overall_progress?.progress_percentage || 0) /
                            100)
                      }
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="Heading-2 text-(--color-text-primary)">
                      {data?.overall_progress?.progress_percentage || 0}%
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-(--color-text-secondary) Body-Extra-Small">
                  Total Course Progress
                </p>
              </div>

              <div className="space-y-2">
                <p className="Body-Small text-(--color-text-Primary)">
                  Estimated{' '}
                  {data?.overall_progress?.estimated_time_left_hours || 0} hours
                  left to complete {data?.course?.title}
                </p>

                <p className="Body-Small text-(--color-text-Primary)">
                  Your pace is ahead of 62% of students
                </p>

                <p className="Body-Small text-(--color-text-Primary)">
                  You may complete this course by{' '}
                  {data?.overall_progress?.expected_completion_date
                    ? new Date(
                        data.overall_progress.expected_completion_date
                      ).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>

                <div className="pt-4 flex justify-between items-end">
                  <span className="text-(--color-text-tertiary) Caption-Small">
                    {data?.overall_progress?.completed_chapters || 0}/
                    {data?.overall_progress?.total_chapters || 0} Chapters
                    Completed
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Videos Completed Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-(--color-bg-hover) rounded-xl p-5 flex justify-between items-center"
            >
              <span className="text-(--color-text-secondary) Caption">
                Completed videos
              </span>

              <span className="Body-Large text-(--color-text-primary)">
                {data?.completion_summary?.completed_videos || 0}/
                {data?.completion_summary?.total_videos || 0}
              </span>
            </motion.div>

            {/* Weekly Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-(--color-bg-hover) rounded-xl p-5 flex flex-col items-center text-center"
            >
              <div className="text-(--color-info-500) mb-4">
                <Image
                  src="/thumbs-up.svg"
                  alt="Thumbs Up"
                  width={47}
                  height={53}
                />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-(--color-text-primary) Navigation-Tab">
                  Watched {data?.highlights?.watched_hours_this_week || 0} hours
                  this week
                </p>

                <p className="text-(--color-text-secondary) Navigation-Tab">
                  Completed{' '}
                  {data?.highlights?.completed_modules_this_month || 0} modules
                  this month
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {/* Watch Time Chart */}
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-(--color-text-tertiary) Body-Extra-Small"
            >
              Watch Time/ Study Activity
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="border border-(--color-border-medium) rounded-xl p-5"
            >
              <div className="flex justify-between">
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-(--color-text-secondary) Caption mb-1">
                      This Week :
                    </p>

                    <p className="Heading-4 text-(--color-text-primary)">
                      {data?.watch_time?.this_week_label || '0 hr'}
                    </p>
                  </div>

                  <p className="text-(--color-text-secondary) Caption">
                    Avg/ Day{' '}
                    <span className="text-(--color-text-primary) Navigation-Tab ml-1">
                      {data?.watch_time?.average_per_day_label || '0 min'}
                    </span>
                  </p>
                </div>

                {/* Bar Chart Visualization */}
                <div className="flex items-end gap-2 pb-1 border border-(--color-border-light) rounded-md px-3 pt-4 h-24">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                    (dayStr, i) => {
                      const dayData = data?.weekly_activity?.find(
                        (d) => d.day === dayStr
                      );
                      const maxSeconds = Math.max(
                        ...(data?.weekly_activity?.map(
                          (d) => d.watch_seconds
                        ) || [1])
                      );
                      const h = dayData
                        ? dayData.watch_seconds / (maxSeconds || 1)
                        : 0;

                      return (
                        <div
                          key={i}
                          className="group relative flex flex-col items-center gap-2 h-full justify-end"
                        >
                          <div
                            className="w-3 bg-(--color-success-600) rounded-t-sm"
                            style={{ height: `${h * 70}%` }}
                          />

                          <span className="text-[10px] text-(--color-text-disabled)">
                            {dayStr.charAt(0)}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </motion.div>

            {/* Recently Watched */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4"
            >
              <h3 className="text-(--color-text-tertiary) Body-Extra-Small">
                Recently watched videos
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="border border-(--color-border-medium) rounded-xl overflow-hidden p-3"
            >
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 transition-colors bg-(--color-bg-secondary) rounded-xl cursor-pointer group"
                  >
                    <div className="relative w-22 h-14 rounded-md overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60`}
                        alt="Thumbnail"
                        className="object-cover"
                        fill
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <Play size={12} className="text-white fill-current" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-(--color-text-primary) Body-Small truncate">
                        Understanding Different Types of...
                      </p>
                    </div>

                    <span className="text-(--color-text-tertiary) Caption me-2">
                      Preview
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

const Analytics = () => {
  return (
    <Suspense
      fallback={<div className="flex flex-col min-h-full w-full relative" />}
    >
      <AnalyticsContent />
    </Suspense>
  );
};

export default Analytics;
