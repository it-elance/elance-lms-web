'use client';

import { useState, useEffect, Suspense } from 'react';
import {
  ChevronLeft,
  Heart,
  Search,
  Check,
  ChevronDown,
  Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useCourseLectures } from '../../../hooks/useCourseLectures';
import { useLectureVideo } from '../../../hooks/useLectureVideo';
import Image from 'next/image';
import Overview from '../../../components/learning/Overview';
import Materials from '../../../components/learning/Materials';
import Notes from '../../../components/learning/Notes';

const VideosContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paperId = searchParams.get('paper_id');
  const topicId = searchParams.get('topic_id');

  const { chapters, isLoading } = useCourseLectures(paperId || '');

  const [activeTab, setActiveTab] = useState('Lectures');
  const [searchQuery, setSearchQuery] = useState('');
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [activeLectureId, setActiveLectureId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !chapters.length) return;

    const selectedLesson = chapters
      .flatMap((chapter) => chapter.lessons || [])
      .find((lesson) => lesson.id === topicId || lesson.video_id === topicId);

    const lectureId = selectedLesson?.id || chapters[0]?.lessons?.[0]?.id;

    if (lectureId && lectureId !== activeLectureId) {
      setActiveLectureId(lectureId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, chapters, topicId]);

  useEffect(() => {
    if (!chapters.length || !activeLectureId) return;

    const currentChapter = chapters.find((chapter) =>
      chapter.lessons?.some((lesson) => lesson.id === activeLectureId)
    );

    if (currentChapter && !openChapters[currentChapter.id]) {
      setOpenChapters((prev) => ({
        ...prev,
        [currentChapter.id]: true,
      }));
    }
  }, [chapters, activeLectureId, openChapters]);

  const { videoData, isLoading: isVideoLoading } =
    useLectureVideo(activeLectureId);

  const toggleChapter = (id: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full relative">
      <div className="sticky top-0 z-30 w-full flex justify-start pointer-events-none bg-(--color-bg-primary) py-4">
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

      <div className="flex flex-col lg:flex-row gap-5 h-full overflow-hidden">
        {/* Left Column: Video Player & Info */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 shrink-0 bg-(--color-bg-primary) lg:pb-0 max-h-[60vh] overflow-y-auto lg:overflow-visible lg:max-h-full lg:overflow-y-auto">
          {/* Video Player Container */}
          <div className="relative aspect-video rounded-md overflow-hidden group bg-black flex items-center justify-center cursor-pointer">
            <AnimatePresence mode="wait">
              {isVideoLoading ? (
                <motion.div
                  key="video-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-(--color-bg-secondary) animate-pulse z-20"
                ></motion.div>
              ) : (
                <motion.div
                  key="video-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {videoData?.thumbnail_url ? (
                    <Image
                      src={videoData?.thumbnail_url}
                      alt="Video Player"
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      priority
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-(--color-bg-secondary) flex items-center justify-center">
                      <Play className="w-8 h-8 text-(--color-text-secondary)" />
                    </div>
                  )}

                  <div className="absolute flex items-center justify-center w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full group-hover:bg-black/50 transition-colors z-10 border border-white/20 shadow-lg">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Video Info */}
          <AnimatePresence mode="wait">
            {isVideoLoading ? (
              <motion.div
                key="info-skeleton"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-start w-full"
              >
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-6 w-3/4 bg-(--color-bg-secondary) animate-pulse rounded"></div>

                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-(--color-bg-secondary) animate-pulse rounded"></div>
                    <div className="h-5 w-24 bg-(--color-bg-secondary) animate-pulse rounded"></div>
                  </div>
                </div>

                <div className="flex gap-3 mt-1">
                  <div className="w-6 h-6 rounded-full bg-(--color-bg-secondary) animate-pulse"></div>
                  <div className="w-6 h-6 rounded-full bg-(--color-bg-secondary) animate-pulse"></div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="info-content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-start w-full"
              >
                <div className="flex-1">
                  <h1 className="Body-Medium text-(--color-text-primary) mb-2">
                    {videoData?.topic_name}
                  </h1>

                  <div className="flex items-center gap-2">
                    <span className="w-fit px-2 pt-0.5 Overline rounded border border-(--color-border-strong) text-(--color-text-secondary) uppercase bg-(--color-bg-secondary)">
                      {videoData?.paper_code}
                    </span>

                    <span className="Body-Extra-Small text-(--color-text-secondary)">
                      {videoData?.chapter}
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <button
                    aria-label="Favourite"
                    className="rounded-full text-(--color-text-secondary) cursor-pointer"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        videoData?.is_favourite
                          ? 'fill-current text-red-500'
                          : ''
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Tabs & Syllabus */}
        <div className="w-full lg:w-1/2 flex flex-col flex-1 min-h-0 lg:h-full">
          {/* Tabs */}
          <div className="flex w-full mb-4 bg-(--color-bg-primary)">
            {['Lectures', 'Overview', 'Materials', 'Notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 pb-1 Body-Small border-b-2 transition-colors border-(--color-border-medium) cursor-pointer ${
                  activeTab === tab
                    ? 'border-(--color-primary-500) text-(--color-primary-500)'
                    : 'text-(--color-text-tertiary)'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'Lectures' && (
              <motion.div
                key="Lectures"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Search */}
                <div className="flex items-center w-full h-10 border border-(--color-border-medium) rounded-full px-5 gap-2 mb-4 focus:outline-none transition-colors custom-search-container">
                  <Search className="w-4 h-4 text-(--color-text-primary) shrink-0" />

                  <input
                    type="text"
                    placeholder="Search lesson"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent Body-Extra-Small focus:outline-hidden placeholder:text-(--color-text-tertiary) translate-y-px"
                  />

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-(--color-text-tertiary) hover:text-(--color-text-primary) cursor-pointer shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Course Content List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-hide">
                  <div className="flex flex-col gap-3">
                    {isLoading ? (
                      <div className="flex flex-col gap-4 py-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex flex-col border-b border-(--color-border-light) pb-4 last:border-0 gap-2"
                          >
                            <div className="h-3 w-24 bg-(--color-bg-secondary) animate-pulse rounded"></div>

                            <div className="flex justify-between items-center">
                              <div className="h-5 w-48 bg-(--color-bg-secondary) animate-pulse rounded"></div>
                              <div className="h-5 w-5 bg-(--color-bg-secondary) animate-pulse rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      chapters.map((chapter, index) => {
                        const isOpen =
                          openChapters[chapter?.id] !== undefined
                            ? openChapters[chapter?.id]
                            : index === 0;
                        return (
                          <div
                            key={chapter?.id}
                            className="flex flex-col border-b border-(--color-border-light) pb-2 last:border-0"
                          >
                            <div
                              className="flex justify-between items-start cursor-pointer group"
                              onClick={() => toggleChapter(chapter?.id)}
                            >
                              <div>
                                <span className="Caption-Small text-(--color-text-tertiary) block mb-1">
                                  Chapter {chapter?.order}:
                                </span>

                                <h3 className="Body-Small text-(--color-text-primary)">
                                  {chapter?.title}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2 me-2.5">
                                {isOpen ? (
                                  <ChevronDown className="w-5 h-5 text-(--color-text-tertiary) transition-transform duration-300 rotate-180" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-(--color-text-tertiary) transition-transform duration-300" />
                                )}
                              </div>
                            </div>

                            {/*Lessons */}
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  key="content"
                                  initial="collapsed"
                                  animate="open"
                                  exit="collapsed"
                                  variants={{
                                    open: {
                                      opacity: 1,
                                      height: 'auto',
                                      marginTop: 12,
                                      transition: {
                                        duration: 0.3,
                                        ease: 'easeInOut',
                                      },
                                    },
                                    collapsed: {
                                      opacity: 0,
                                      height: 0,
                                      marginTop: 0,
                                      transition: {
                                        opacity: { duration: 0.15 },
                                        height: {
                                          duration: 0.3,
                                          ease: 'easeInOut',
                                        },
                                        marginTop: {
                                          duration: 0.3,
                                          ease: 'easeInOut',
                                        },
                                      },
                                    },
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-col gap-1 pl-0">
                                    {chapter?.lessons?.length > 0 ? (
                                      chapter?.lessons.map((lesson) => (
                                        <div
                                          key={lesson?.id}
                                          className={`flex items-center justify-between p-2 cursor-pointer group border-b border-(--color-border-light) last:border-0 ${
                                            activeLectureId === lesson?.id
                                              ? 'bg-(--color-bg-secondary)'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            setActiveLectureId(lesson?.id)
                                          }
                                        >
                                          <div>
                                            <p className="Body-Small text-(--color-text-primary) mb-0.5">
                                              {lesson?.title}
                                            </p>

                                            <p className="Caption-Small text-(--color-text-tertiary)">
                                              {(() => {
                                                const totalSeconds =
                                                  Number(lesson?.duration) || 0;
                                                const h = Math.floor(
                                                  totalSeconds / 3600
                                                );
                                                const m = Math.floor(
                                                  (totalSeconds % 3600) / 60
                                                );
                                                const s = Math.floor(
                                                  totalSeconds % 60
                                                );

                                                const parts = [];
                                                if (h > 0) parts.push(`${h}h`);
                                                if (m > 0 || h > 0)
                                                  parts.push(`${m}m`);
                                                parts.push(`${s}s`);

                                                return parts.join(' ');
                                              })()}
                                            </p>
                                          </div>

                                          <div className="w-6 h-6 flex items-center justify-center">
                                            {lesson?.isCompleted ? (
                                              <div className="w-6 h-6 rounded-full bg-(--color-success-600) flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5 text-white stroke-3" />
                                              </div>
                                            ) : (
                                              <div className="w-6 h-6 rounded-full border-2 border-(--color-border-light)"></div>
                                            )}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="Caption-Small text-(--color-text-tertiary) italic">
                                        No lessons available
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Overview' && (
              <motion.div
                key="Overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <Overview />
              </motion.div>
            )}

            {activeTab === 'Materials' && (
              <motion.div
                key="Materials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto custom-scrollbar scrollbar-hide"
              >
                <Materials lectureId={activeLectureId} />
              </motion.div>
            )}

            {activeTab === 'Notes' && (
              <motion.div
                key="Notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto custom-scrollbar"
              >
                <Notes videoId={videoData?.video_id || ''} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Videos = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-[calc(100vh-6rem)] w-full relative" />
      }
    >
      <VideosContent />
    </Suspense>
  );
};

export default Videos;
