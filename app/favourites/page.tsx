'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, MoreVertical, X, Play } from 'lucide-react';
import FilterModal from '@/components/favourites/FilterModal';
import Image from 'next/image';

interface FavouriteItem {
  id: number;
  title: string;
  duration: string;
  tag: string;
  chapter: string;
  image: string;
}

const mockFavourites: FavouriteItem[] = [
  {
    id: 1,
    title: 'Nonprofit Organizations',
    duration: '12:30 min',
    tag: 'FR',
    chapter: 'Chapter 5',
    image: '/video-thumbnail.svg',
  },
  {
    id: 2,
    title: 'For-Profit Companies',
    duration: '15:10 min',
    tag: 'FA',
    chapter: 'Chapter 6',
    image: '/video-thumbnail.svg',
  },
  {
    id: 3,
    title: 'Government Agencies',
    duration: '8:20 min',
    tag: 'FA',
    chapter: 'Chapter 7',
    image: '/video-thumbnail.svg',
  },
  {
    id: 4,
    title: 'Educational Institutions',
    duration: '10:55 min',
    tag: 'FR',
    chapter: 'Chapter 8',
    image: '/video-thumbnail.svg',
  },
  {
    id: 5,
    title: 'Cooperatives',
    duration: '7:45 min',
    tag: 'FA',
    chapter: 'Chapter 9',
    image: '/video-thumbnail.svg',
  },
  {
    id: 6,
    title: 'Startups',
    duration: '14:00 min',
    tag: 'FA',
    chapter: 'Chapter 10',
    image: '/video-thumbnail.svg',
  },
  {
    id: 7,
    title: 'Social Enterprises',
    duration: '11:15 min',
    tag: 'FA',
    chapter: 'Chapter 11',
    image: '/video-thumbnail.svg',
  },
  {
    id: 8,
    title: 'Nonprofit Organizations',
    duration: '12:30 min',
    tag: 'FR',
    chapter: 'Chapter 5',
    image: '/video-thumbnail.svg',
  },
  {
    id: 9,
    title: 'For-Profit Companies',
    duration: '15:10 min',
    tag: 'FA',
    chapter: 'Chapter 6',
    image: '/video-thumbnail.svg',
  },
  {
    id: 10,
    title: 'Government Agencies',
    duration: '8:20 min',
    tag: 'FA',
    chapter: 'Chapter 7',
    image: '/video-thumbnail.svg',
  },
  {
    id: 11,
    title: 'Educational Institutions',
    duration: '10:55 min',
    tag: 'FR',
    chapter: 'Chapter 8',
    image: '/video-thumbnail.svg',
  },
  {
    id: 12,
    title: 'Cooperatives',
    duration: '7:45 min',
    tag: 'FA',
    chapter: 'Chapter 9',
    image: '/video-thumbnail.svg',
  },
  {
    id: 13,
    title: 'Startups',
    duration: '14:00 min',
    tag: 'FA',
    chapter: 'Chapter 10',
    image: '/video-thumbnail.svg',
  },
  {
    id: 14,
    title: 'Social Enterprises',
    duration: '11:15 min',
    tag: 'FA',
    chapter: 'Chapter 11',
    image: '/video-thumbnail.svg',
  },
];

const Favourites = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Lectures' | 'Materials'>(
    'Lectures'
  );
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<
    'Paper' | 'Chapter' | null
  >(null);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  // Unique lists from mock data
  const uniquePapers = Array.from(
    new Set(mockFavourites.map((item) => item.tag))
  );

  const uniqueChapters = Array.from(
    new Set(mockFavourites.map((item) => item.chapter))
  );

  const handleFilterClick = (filterName: string) => {
    if (filterName === 'All') {
      setSelectedPapers([]);
      setSelectedChapters([]);
      setSearchQuery('');
    } else if (filterName === 'Paper') {
      setActiveFilterType('Paper');
      setIsFilterModalOpen(true);
    } else if (filterName === 'Chapter') {
      setActiveFilterType('Chapter');
      setIsFilterModalOpen(true);
    }
  };

  const filteredItems = mockFavourites.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPaper =
      selectedPapers.length === 0 || selectedPapers.includes(item.tag);
    const matchesChapter =
      selectedChapters.length === 0 || selectedChapters.includes(item.chapter);
    return matchesSearch && matchesPaper && matchesChapter;
  });

  const filters = [
    { name: 'All', icon: '/filter.svg' },
    { name: 'Paper', icon: '/paper.svg' },
    { name: 'Chapter', icon: '/book.svg' },
  ];

  return (
    <div className="flex flex-col w-full bg-(--color-bg-primary)">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 bg-(--color-bg-primary) pb-2">
        {/* Desktop Header */}
        <div className="hidden lg:flex w-full bg-(--color-bg-primary) py-4 items-center justify-between">
          {/* <div className="flex items-center gap-4 flex-1">
            <motion.button
              onClick={() => router.back()}
              className="rounded-full transition-colors cursor-pointer p-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6 text-(--color-text-primary)" />
            </motion.button>
          </div> */}

          <h1 className="Heading-3 font-semibold text-(--color-text-primary) absolute left-1/2 -translate-x-1/2">
            Favourites
          </h1>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center relative w-64 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-primary)" />
              <input
                type="text"
                placeholder="Search Favourites"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-(--color-bg-secondary) Body-Small border border-(--color-border-medium) rounded-full focus:outline-none placeholder:text-(--color-text-disabled) text-(--color-text-primary)"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden w-full bg-(--color-bg-primary) py-4 flex flex-col gap-2">
          <h1 className="Heading-3 font-semibold text-(--color-text-primary)">
            Favourites
          </h1>

          <div className="flex items-center gap-3">
            {/* <motion.button
              onClick={() => router.back()}
              className="rounded-full transition-colors cursor-pointer hover:bg-(--color-bg-tertiary) p-1 shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6 text-(--color-text-primary)" />
            </motion.button> */}

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-primary)" />
              <input
                type="text"
                placeholder="Search Favourites"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-(--color-bg-secondary) Body-Small border border-(--color-border-medium) rounded-full focus:outline-none placeholder:text-(--color-text-disabled) text-(--color-text-primary)"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-(--color-border-light) mb-3">
          {['Lectures', 'Materials'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'Lectures' | 'Materials')}
              className={`px-6 pb-2 Body-Small transition-colors relative cursor-pointer ${
                activeTab === tab
                  ? 'text-(--color-primary-500)'
                  : 'text-(--color-text-tertiary)'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="favouritesActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-primary-500)"
                />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="w-full bg-(--color-bg-primary)">
          <div className="flex items-center gap-3">
            {filters.map((filter) => {
              const isPaperSelected =
                filter.name === 'Paper' && selectedPapers.length > 0;
              const isChapterSelected =
                filter.name === 'Chapter' && selectedChapters.length > 0;
              const isAllSelected =
                filter.name === 'All' &&
                selectedPapers.length === 0 &&
                selectedChapters.length === 0;

              // Determine active state visually
              const isActive =
                (filter.name === 'All' && isAllSelected) ||
                (filter.name === 'Paper' && isPaperSelected) ||
                (filter.name === 'Chapter' && isChapterSelected);

              return (
                <button
                  key={filter.name}
                  onClick={() => handleFilterClick(filter.name)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-colors Body-Small cursor-pointer ${
                    isActive
                      ? 'border-(--color-primary-500) text-(--color-primary-500)'
                      : 'border-(--color-border-medium) text-(--color-text-primary)'
                  }`}
                >
                  <div
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'bg-(--color-primary-500)'
                        : 'bg-(--color-text-tertiary)'
                    }`}
                    style={{
                      maskImage: `url(${filter.icon})`,
                      WebkitMaskImage: `url(${filter.icon})`,
                      maskSize: '100% 100%',
                      WebkitMaskSize: '100% 100%',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                    }}
                  />
                  {filter.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto mt-3">
        <div className="flex flex-col gap-2">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-row items-center gap-3 p-2 rounded-lg bg-(--color-bg-secondary) transition-colors cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative w-28 aspect-video rounded-md overflow-hidden shrink-0 group/thumbnail">
                <Image
                  src="/video.png"
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {/* Overlay Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 lg:bg-black/0 group-hover/thumbnail:bg-black/30 transition-all duration-300 opacity-100 lg:opacity-0 group-hover/thumbnail:opacity-100">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center group-hover/thumbnail:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 md:w-5 md:h-5 text-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h3 className="Body-Small font-medium text-(--color-text-primary) mb-1 truncate">
                  {item.title}
                </h3>

                <div className="Caption-Small text-(--color-text-tertiary) mb-1.5 flex items-center gap-2">
                  <span>{item.duration}</span>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold text-(--color-text-secondary) border border-(--color-border-medium) rounded">
                    {item.tag}
                  </span>

                  <span className="Caption-Small text-(--color-text-secondary) truncate">
                    {item.chapter}
                  </span>

                  <div className="w-px h-3 bg-(--color-text-disabled) rounded-full" />

                  <span className="Caption-Small text-(--color-text-secondary) truncate">
                    Topic Name
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 md:gap-2 shrink-0 self-center">
                <button className="p-1.5 rounded-full transition-colors text-(--color-primary-500) cursor-pointer hover:bg-(--color-bg-tertiary)">
                  <Heart className="w-5 h-5 fill-current" />
                </button>

                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === item.id ? null : item.id)
                    }
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      activeMenuId === item.id
                        ? 'bg-(--color-bg-tertiary) text-(--color-text-primary)'
                        : 'text-(--color-text-tertiary) hover:bg-(--color-bg-tertiary)'
                    }`}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full w-44 p-1 bg-(--color-bg-primary) rounded-lg shadow-xs border border-(--color-border-light) z-50 overflow-hidden"
                      >
                        <button className="w-full text-left px-2 py-2 Body-Small text-(--color-text-primary) border-b border-(--color-border-light) cursor-pointer hover:bg-(--color-bg-tertiary) rounded-md transition-colors">
                          View chapter details
                        </button>

                        <button className="w-full text-left px-2 py-2 Body-Small text-(--color-error-600) cursor-pointer hover:bg-(--color-bg-tertiary) rounded-md transition-colors">
                          Remove from favourites
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Modal */}
      <AnimatePresence>
        {isFilterModalOpen && activeFilterType && (
          <FilterModal
            type={activeFilterType}
            options={
              activeFilterType === 'Paper' ? uniquePapers : uniqueChapters
            }
            selectedValues={
              activeFilterType === 'Paper' ? selectedPapers : selectedChapters
            }
            onClose={() => {
              setIsFilterModalOpen(false);
              setActiveFilterType(null);
            }}
            onApply={(selected) => {
              if (activeFilterType === 'Paper') {
                setSelectedPapers(selected);
              } else {
                setSelectedChapters(selected);
              }
              setIsFilterModalOpen(false);
              setActiveFilterType(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favourites;
