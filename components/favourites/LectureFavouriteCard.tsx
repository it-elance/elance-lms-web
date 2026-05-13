import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MoreVertical, Play } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { FavouriteLecture } from '@/types/favourite.types';

interface LectureFavouriteCardProps {
  lecture: FavouriteLecture;
  index: number;
  paperId: string;
  activeMenuId: string | null;
  onMenuToggle: (id: string | null) => void;
  onToggleFavourite: (payload: {
    entity_type: 'lecture';
    entity_id: string;
    is_favourite: boolean;
  }) => void;
}

const formatDuration = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
};

const LectureFavouriteCard = ({
  lecture,
  index,
  paperId,
  activeMenuId,
  onMenuToggle,
  onToggleFavourite,
}: LectureFavouriteCardProps) => {
  const router = useRouter();
  const lectureUrl = `/learning/videos?paper_id=${paperId}&topic_id=${lecture?.lecture_id}`;

  const handleCardClick = () => {
    router.push(lectureUrl);
  };

  return (
    <div onClick={handleCardClick} className="block cursor-pointer group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex flex-row items-center gap-3 p-2 rounded-lg bg-(--color-bg-secondary) transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative w-28 aspect-video rounded-md overflow-hidden shrink-0 group/thumbnail">
          <Image
            src={lecture?.thumbnail_url || ''}
            alt={lecture?.title || ''}
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
            {lecture?.title || ''}
          </h3>

          <div className="Caption-Small text-(--color-text-tertiary) mb-1.5 flex items-center gap-2">
            <span>{formatDuration(lecture?.duration_seconds || 0)}</span>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold text-(--color-text-secondary) border border-(--color-border-medium) rounded">
              {lecture?.paper?.code || ''}
            </span>

            <span className="Caption-Small text-(--color-text-secondary) truncate">
              {lecture?.chapter?.title || ''}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 md:gap-2 shrink-0 self-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavourite({
                entity_type: 'lecture',
                entity_id: lecture?.lecture_id || '',
                is_favourite: false,
              });
            }}
            className="p-1.5 rounded-full transition-colors text-(--color-primary-500) cursor-pointer hover:bg-(--color-bg-tertiary)"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>

          <div
            className="relative"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              onClick={() =>
                onMenuToggle(
                  activeMenuId === lecture?.lecture_id
                    ? null
                    : lecture?.lecture_id
                )
              }
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                activeMenuId === lecture?.lecture_id
                  ? 'bg-(--color-bg-tertiary) text-(--color-text-primary)'
                  : 'text-(--color-text-tertiary) hover:bg-(--color-bg-tertiary)'
              }`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {activeMenuId === lecture?.lecture_id && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full w-44 p-1 bg-(--color-bg-primary) rounded-lg shadow-xs border border-(--color-border-light) z-50 overflow-hidden"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(lectureUrl);
                    }}
                    className="w-full text-left px-2 py-2 Body-Small text-(--color-text-primary) border-b border-(--color-border-light) cursor-pointer hover:bg-(--color-bg-tertiary) rounded-md transition-colors"
                  >
                    View lecture details
                  </button>

                  <button
                    onClick={() => {
                      onToggleFavourite({
                        entity_type: 'lecture',
                        entity_id: lecture?.lecture_id || '',
                        is_favourite: false,
                      });
                      onMenuToggle(null);
                    }}
                    className="w-full text-left px-2 py-2 Body-Small text-(--color-error-600) cursor-pointer hover:bg-(--color-bg-tertiary) rounded-md transition-colors"
                  >
                    Remove from favourites
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LectureFavouriteCard;
