'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMyLearning } from '@/hooks/useMyLearning';
import Image from 'next/image';
import Link from 'next/link';

const MotionLink = motion.create(Link);

// Skeleton Card
const SkeletonCard = () => (
  <div className="border border-(--color-border) rounded-xl p-3 animate-pulse">
    <div className="h-32 w-full rounded bg-(--color-bg-tertiary)" />

    <div className="pt-2 space-y-2">
      <div className="h-4 w-3/4 rounded bg-(--color-bg-tertiary)" />

      <div className="flex items-end justify-between pt-3">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-10 rounded bg-(--color-bg-tertiary)" />
          <div className="h-3 w-20 rounded bg-(--color-bg-tertiary)" />
        </div>

        <div className="w-14 h-14 rounded-full bg-(--color-bg-tertiary)" />
      </div>
    </div>
  </div>
);

const Learning = () => {
  const { subjects, pagination, isLoading, page, setPage } = useMyLearning();

  return (
    <div className="flex flex-col gap-4 mt-3 h-full">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : subjects?.map((subject, index) => {
              const circumference = 138.2;
              const offset =
                circumference -
                (circumference * subject?.progress_percentage) / 100;

              return (
                <MotionLink
                  key={subject?.id}
                  href={`/learning/videos?paper_id=${subject?.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="block border border-(--color-border) rounded-xl p-3 group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative h-32 w-full rounded overflow-hidden bg-(--color-bg-tertiary)">
                    {subject?.icon_url ? (
                      <Image
                        src={subject?.icon_url}
                        alt={subject?.title}
                        fill
                        className="object-cover"
                        priority={index < 4}
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-(--color-text-tertiary) uppercase">
                          {subject?.code}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-2 relative">
                    {/* Title */}
                    <h3 className="Body-Small text-(--color-text-primary) mb-2 truncate">
                      {subject?.title}
                    </h3>

                    {/* Code & Chapters */}
                    <div className="flex items-end justify-between pt-3">
                      <div className="flex flex-col gap-2">
                        {/* Code badge */}
                        <span className="w-fit px-2 pt-0.5 Overline rounded border border-(--color-border-strong) text-(--color-text-secondary) uppercase bg-(--color-bg-secondary)">
                          {subject?.code}
                        </span>

                        {/* Chapter count */}
                        <span className="Caption-Small text-(--color-text-tertiary)">
                          <span className="Overline">
                            {subject?.completed_chapters}
                          </span>
                          /{subject?.total_chapters} Chapters
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
                          stroke={
                            subject?.progress_percentage === 100
                              ? 'var(--color-success-600)'
                              : 'var(--color-success-600)'
                          }
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>

                      <span className="absolute Caption-Small text-(--color-text-tertiary)">
                        {subject?.progress_percentage}%
                      </span>
                    </div>
                  </div>
                </MotionLink>
              );
            })}
      </div>

      {/* Pagination */}
      {!isLoading && pagination && pagination?.total_pages > 1 && (
        <nav
          aria-label="pagination"
          className="mx-auto flex w-full justify-center py-4"
        >
          <ul className="flex flex-row items-center gap-1">
            <li>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination?.has_previous}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border) disabled:pointer-events-none disabled:opacity-50 hover:bg-(--color-bg-secondary) hover:text-(--color-text-primary) h-9 px-4 py-2 gap-1 pl-2.5 text-(--color-text-primary)"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            </li>

            {Array.from(
              { length: pagination?.total_pages || 1 },
              (_, i) => i + 1
            ).map((p) => (
              <li key={p}>
                <button
                  onClick={() => setPage(p)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border) disabled:pointer-events-none disabled:opacity-50 hover:bg-(--color-bg-secondary) hover:text-(--color-text-primary) h-9 w-9 ${
                    p === page
                      ? 'border border-(--color-border) bg-(--color-bg-primary) shadow-sm text-(--color-text-primary)'
                      : 'text-(--color-text-secondary)'
                  }`}
                >
                  {p}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination?.total_pages || 1, p + 1))
                }
                disabled={!pagination?.has_next}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border) disabled:pointer-events-none disabled:opacity-50 hover:bg-(--color-bg-secondary) hover:text-(--color-text-primary) h-9 px-4 py-2 gap-1 pr-2.5 text-(--color-text-primary)"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Empty state */}
      {!isLoading && subjects?.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] gap-3">
          <Image
            src="/empty-papers.svg"
            alt="No papers"
            width={70}
            height={70}
            className="opacity-90"
          />

          <div className="flex flex-col items-center gap-1.5 mt-2">
            <h3 className="Heading-4 text-(--color-text-primary)">
              No Study Papers Yet
            </h3>

            <p className="Body-Small text-(--color-text-tertiary) text-center max-w-xs">
              There are currently no papers assigned to your learning plan. New
              papers will appear here once available.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;
