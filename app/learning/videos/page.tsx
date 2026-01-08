'use client';

import { useState } from 'react';
import { ChevronLeft, Heart, Search, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Overview from '../../../components/learning/Overview';
import Materials from '../../../components/learning/Materials';
import Notes from '../../../components/learning/Notes';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
  isOpen: boolean;
}

const Videos = () => {
  const [activeTab, setActiveTab] = useState('Lectures');
  const [searchQuery, setSearchQuery] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 1,
      title: 'Chapter 1 : Business Organization & Structure',
      isOpen: false,
      lessons: [],
    },
    {
      id: 2,
      title: 'Chapter 2 : Business Environment',
      isOpen: true,
      lessons: [
        { id: 1, title: 'HR functions', duration: '9:47 min', completed: true },
        {
          id: 2,
          title: 'Marketing functions',
          duration: '9:47 min',
          completed: true,
        },
        {
          id: 3,
          title: 'Operation functions',
          duration: '9:47 min',
          completed: false,
        },
        {
          id: 4,
          title: 'Finance functions',
          duration: '9:47 min',
          completed: false,
        },
      ],
    },
    {
      id: 3,
      title: 'Chapter 3 : Organizational Culture & Leadership',
      isOpen: true,
      lessons: [
        {
          id: 5,
          title: 'HR functions',
          duration: '9:47 min',
          completed: true,
        },
        {
          id: 6,
          title: 'Marketing functions',
          duration: '9:47 min',
          completed: true,
        },
        {
          id: 7,
          title: 'Operation functions',
          duration: '9:47 min',
          completed: false,
        },
        {
          id: 8,
          title: 'Finance functions',
          duration: '9:47 min',
          completed: false,
        },
      ],
    },
  ]);

  const router = useRouter();

  const toggleChapter = (id: number) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === id ? { ...chapter, isOpen: !chapter.isOpen } : chapter
      )
    );
  };

  return (
    <motion.div
      className="min-h-full lg:h-[calc(100vh-6rem)] bg-(--color-bg-primary) relative flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Back Button */}
      <motion.div className="sticky top-0 z-10 w-full flex justify-start pointer-events-none">
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
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-5 h-full overflow-hidden mt-3">
        {/* Left Column: Video Player & Info */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-y-auto">
          {/* Video Player Container */}
          <div className="relative aspect-video rounded-md overflow-hidden group">
            <Image
              src="/video.svg"
              alt="Video Player"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Video Info */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="Body-Medium text-(--color-text-primary) mb-2">
                Straight-line vs Reducing Balance Depreciation
              </h1>

              <div className="flex items-center gap-2">
                <span className="w-fit px-2 pt-0.5 Overline rounded border border-(--color-border-strong) text-(--color-text-secondary) uppercase bg-(--color-bg-secondary)">
                  FA
                </span>

                <span className="Body-Extra-Small text-(--color-text-secondary)">
                  Non-Current Assets & Depreciation
                </span>
              </div>
            </div>

            <div className="flex">
              <button className="pe-3 rounded-full text-(--color-text-secondary) cursor-pointer">
                <Heart className="w-5 h-5" />
              </button>

              <button className="rounded-full text-(--color-text-secondary) cursor-pointer">
                <Image
                  src="/download.svg"
                  alt="Download"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs & Syllabus */}
        <div className="w-full lg:w-1/2 flex flex-col h-full">
          {/* Tabs */}
          <div className="flex w-full mb-4">
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
                <div className="flex items-center w-full h-10 border border-(--color-border-medium) rounded-full px-5 gap-2 mb-6 focus:outline-none transition-colors custom-search-container">
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
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-3">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex flex-col border-b border-(--color-border-light) pb-2 last:border-0"
                      >
                        <div
                          className="flex justify-between items-start cursor-pointer group"
                          onClick={() => toggleChapter(chapter.id)}
                        >
                          <div>
                            <span className="Caption-Small text-(--color-text-tertiary) block mb-1">
                              Chapter {chapter.id} :
                            </span>

                            <h3 className="Body-Small text-(--color-text-primary)">
                              {chapter.title.split(' : ')[1]}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 me-2.5">
                            <span className="Caption text-(--color-primary-500) flex items-center gap-1 cursor-pointer">
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14.1654 9.99967L9.9987 14.1663M9.9987 14.1663L5.83203 9.99967M9.9987 14.1663V3.33301M14.1654 16.6663H5.83203"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>{' '}
                              Download All
                            </span>

                            {chapter.isOpen ? (
                              <ChevronDown className="w-5 h-5 text-(--color-text-tertiary) transition-transform duration-300 rotate-180" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-(--color-text-tertiary) transition-transform duration-300" />
                            )}
                          </div>
                        </div>

                        <AnimatePresence initial={false}>
                          {chapter.isOpen && (
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
                                {chapter.lessons.length > 0 ? (
                                  chapter.lessons.map((lesson) => (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center justify-between p-2 cursor-pointer group border-b border-(--color-border-light) last:border-0"
                                    >
                                      <div>
                                        <p className="Body-Small text-(--color-text-primary) mb-0.5">
                                          {lesson.title}
                                        </p>

                                        <p className="Caption-Small text-(--color-text-tertiary)">
                                          {lesson.duration}
                                        </p>
                                      </div>

                                      <div className="w-6 h-6 flex items-center justify-center">
                                        {lesson.completed ? (
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
                    ))}
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
                className="flex-1 flex flex-col overflow-hidden"
              >
                <Materials />
              </motion.div>
            )}

            {activeTab === 'Notes' && (
              <motion.div
                key="Notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <Notes />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Videos;
