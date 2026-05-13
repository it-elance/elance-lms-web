'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import type { GlobalSearchTopic } from '@/types/search.types';

interface SearchResultsProps {
  topics: GlobalSearchTopic[];
  isLoading: boolean;
  query: string;
  debouncedQuery: string;
  isMobile?: boolean;
  onSelectResult: () => void;
}

const SearchResults = ({
  topics,
  isLoading,
  query,
  debouncedQuery,
  isMobile = false,
  onSelectResult,
}: SearchResultsProps) => {
  const router = useRouter();
  const isDebouncing = query.trim() !== debouncedQuery;
  const isPending = isLoading || isDebouncing;
  const hasQuery = query.trim().length > 0;

  if (!hasQuery) {
    return (
      <div
        className={`flex flex-col justify-center text-center px-4 ${
          isMobile ? 'flex-1 mb-20' : 'py-10 min-h-[30vh]'
        }`}
      >
        <h3 className="Body-Medium font-semibold text-(--color-text-primary) mb-2">
          Find Your Lectures
        </h3>

        <p className="Body-Small text-(--color-text-tertiary) max-w-sm mx-auto">
          Search for specific topics across your syllabus to access relevant
          learning content instantly.
        </p>
      </div>
    );
  }

  if (isPending && topics.length === 0) {
    return (
      <div className="flex flex-col gap-2 px-1 py-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-16 w-full bg-(--color-bg-tertiary) rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`space-y-4 ${
        isMobile && topics.length === 0 && !isPending
          ? 'flex-1 flex flex-col'
          : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={
          isMobile && topics.length === 0 && !isPending
            ? 'flex-1 flex flex-col'
            : ''
        }
      >
        {/* {topics.length > 0 && !isPending && (
          <h3 className="Body-Extra-Small text-(--color-text-tertiary) mb-3 px-1">
            {`Topics (${topics.length})`}
          </h3>
        )} */}

        <div
          className={`flex flex-col custom-scrollbar ${
            isMobile && topics.length === 0 && !isPending
              ? 'flex-1 justify-center pb-20'
              : 'max-h-[70vh] lg:max-h-[80vh] overflow-y-auto'
          }`}
        >
          {topics.map((topic, index) => (
            <motion.div
              key={topic?.topic_id}
              onClick={() => {
                router.push(
                  `/learning/videos?paper_id=${topic?.paper?.paper_id}&topic_id=${topic?.topic_id}`
                );
                onSelectResult();
              }}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-(--color-bg-tertiary) transition-colors ${
                index !== topics.length - 1
                  ? 'border-b border-(--color-border-light) mb-2'
                  : ''
              }`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="Body-Small text-(--color-text-primary) truncate">
                  {topic?.title}
                </div>

                <div className="Caption-Small text-(--color-text-tertiary) mt-0.5 flex items-center gap-2">
                  <span className="shrink-0">{topic?.duration_label}</span>
                  <span className="w-1 h-1 rounded-full bg-(--color-text-tertiary) shrink-0" />
                  <span className="truncate">{topic?.paper?.title}</span>
                </div>
              </div>

              <div className="shrink-0">
                <div className="w-6 h-6 rounded-full border-2 border-(--color-border-light) flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-(--color-border-light)" />
                </div>
              </div>
            </motion.div>
          ))}

          {!isPending && topics.length === 0 && (
            <div
              className={`flex flex-col items-center justify-center px-4 text-center ${
                isMobile ? 'flex-1' : 'py-12'
              }`}
            >
              <Image
                src="/empty-search.svg"
                alt="No results"
                width={80}
                height={80}
                className="mb-4 opacity-80"
              />

              <h3 className="Body-Medium font-semibold text-(--color-text-primary) mb-2">
                No Lectures Found
              </h3>

              <p className="Body-Small text-(--color-text-tertiary) max-w-xs mx-auto">
                We couldn&apos;t find any matching topics. Try a different
                keyword or browse related chapters.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
