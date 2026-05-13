'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Image from 'next/image';

import FilterModal from '@/components/favourites/FilterModal';
import LectureFavouriteCard from '@/components/favourites/LectureFavouriteCard';
import MaterialFavouriteCard from '@/components/favourites/MaterialFavouriteCard';

import { useTheme } from '@/components/ThemeProvider';

import {
  useFavourite,
  useFavouriteLectures,
  useFavouriteMaterials,
} from '@/hooks/useFavourite';

import { usePapers } from '@/hooks/usePapers';
import { useChapters } from '@/hooks/useChapters';
import { useDebounce } from '@/hooks/useDebounce';

const FILTERS = [
  { name: 'All', icon: '/filter.svg' },
  { name: 'Paper', icon: '/paper.svg' },
  { name: 'Chapter', icon: '/book.svg' },
] as const;

type TabType = 'Lectures' | 'Materials';
type FilterType = 'Paper' | 'Chapter';

const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="relative w-full">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-primary)" />

    <input
      type="text"
      placeholder="Search Favourites"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-10 py-2 bg-(--color-bg-secondary) Body-Small border border-(--color-border-medium) rounded-full focus:outline-none placeholder:text-(--color-text-disabled) text-(--color-text-primary)"
    />

    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

const Favourites = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [activeTab, setActiveTab] = useState<TabType>('Lectures');

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [activeFilterType, setActiveFilterType] = useState<FilterType | null>(
    null
  );

  const [filters, setFilters] = useState({
    papers: [] as string[],
    chapters: [] as string[],
  });

  const { resolvedTheme } = useTheme();

  const { toggleFavourite } = useFavourite();

  const { data: papersData } = usePapers();

  const papers = useMemo(() => papersData?.data?.papers ?? [], [papersData]);

  const paperCodeMap = useMemo(
    () =>
      papers.reduce<Record<string, string>>((acc, paper) => {
        acc[paper.code] = paper.paper_id;
        return acc;
      }, {}),
    [papers]
  );

  const selectedPaperId = papers.find((paper) =>
    filters.papers.includes(paper.code)
  )?.paper_id;

  const shouldFetchChapters =
    isFilterModalOpen && activeFilterType === 'Chapter' && !!selectedPaperId;

  const { data: chaptersData } = useChapters(
    selectedPaperId,
    shouldFetchChapters
  );

  const chapters = useMemo(
    () => chaptersData?.data?.chapters ?? [],
    [chaptersData]
  );

  const selectedChapterId = chapters.find((chapter) =>
    filters.chapters.includes(chapter.title)
  )?.chapter_id;

  const chapterOptions = useMemo(
    () =>
      activeFilterType === 'Chapter'
        ? chapters.map((chapter) => chapter.title)
        : [],
    [activeFilterType, chapters]
  );

  const { data: lecturesData, isLoading: isLoadingLectures } =
    useFavouriteLectures(
      {
        paperId: selectedPaperId,
        chapterId: selectedChapterId,
        search: debouncedSearch,
      },
      activeTab === 'Lectures'
    );

  const { data: materialsData, isLoading: isLoadingMaterials } =
    useFavouriteMaterials(
      {
        paperId: selectedPaperId,
        chapterId: selectedChapterId,
        search: debouncedSearch,
      },
      activeTab === 'Materials'
    );

  const lectureItems = useMemo(
    () => lecturesData?.data?.lectures ?? [],
    [lecturesData]
  );

  const materialItems = useMemo(
    () => materialsData?.data?.materials ?? [],
    [materialsData]
  );

  const isLoading =
    activeTab === 'Lectures' ? isLoadingLectures : isLoadingMaterials;

  const hasItems =
    activeTab === 'Lectures'
      ? lectureItems.length > 0
      : materialItems.length > 0;

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleFilterClick = (filterName: string) => {
    if (filterName === 'All') {
      setFilters({
        papers: [],
        chapters: [],
      });

      setSearchQuery('');

      return;
    }

    setActiveFilterType(filterName as FilterType);
    setIsFilterModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full bg-(--color-bg-primary)">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-(--color-bg-primary) pb-2">
        {/* Desktop */}
        <div className="hidden lg:flex w-full py-4 items-center justify-end">
          <div className="w-64 lg:w-80">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden py-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-(--color-border-light) mb-3">
          {(['Lectures', 'Materials'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
        <div className="flex items-center gap-3">
          {FILTERS.map((filter) => {
            const isActive =
              (filter.name === 'All' &&
                filters.papers.length === 0 &&
                filters.chapters.length === 0) ||
              (filter.name === 'Paper' && filters.papers.length > 0) ||
              (filter.name === 'Chapter' && filters.chapters.length > 0);

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
                  className={`w-4 h-4 ${
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

      {/* Content */}
      <div className="flex-1 mt-3">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 w-full bg-(--color-bg-secondary) rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : !hasItems ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] gap-3">
            <Image
              src="/empty-favourites.svg"
              alt="No favourites"
              width={90}
              height={90}
              className="opacity-90"
            />

            <div className="flex flex-col items-center gap-1.5 mt-2">
              <h3 className="Heading-4 text-(--color-text-primary)">
                No Favourites Yet
              </h3>

              <p className="Body-Small text-(--color-text-tertiary) text-center max-w-xs">
                Add lessons to favourites for quick access <br />
                anytime
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-6">
            {activeTab === 'Lectures'
              ? lectureItems.map((lecture, index) => (
                  <LectureFavouriteCard
                    key={lecture?.lecture_id}
                    lecture={lecture}
                    index={index}
                    paperId={paperCodeMap[lecture?.paper?.code || '']}
                    activeMenuId={activeMenuId}
                    onMenuToggle={setActiveMenuId}
                    onToggleFavourite={toggleFavourite}
                  />
                ))
              : materialItems.map((material, index) => (
                  <MaterialFavouriteCard
                    key={material?.material_id}
                    material={material}
                    index={index}
                    resolvedTheme={resolvedTheme as 'light' | 'dark'}
                    activeMenuId={activeMenuId}
                    onMenuToggle={setActiveMenuId}
                    onToggleFavourite={toggleFavourite}
                  />
                ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && activeFilterType && (
          <FilterModal
            type={activeFilterType}
            options={
              activeFilterType === 'Paper'
                ? papers.map((p) => p.code)
                : chapterOptions
            }
            selectedValues={
              activeFilterType === 'Paper' ? filters.papers : filters.chapters
            }
            onClose={() => {
              setIsFilterModalOpen(false);
              setActiveFilterType(null);
            }}
            onApply={(selected) => {
              if (activeFilterType === 'Paper') {
                setFilters({
                  papers: selected,
                  chapters: [],
                });
              } else {
                setFilters((prev) => ({
                  ...prev,
                  chapters: selected,
                }));
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
