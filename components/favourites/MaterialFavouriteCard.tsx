import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import type { FavouriteMaterial } from '@/types/favourite.types';

const FILE_TYPE_THUMBNAILS = ['pdf', 'ppt', 'xls', 'jpg', 'doc'];

const FILE_TYPE_MAP: Record<string, string> = {
  docx: 'doc',
  xlsx: 'xls',
  pptx: 'ppt',
};

const getMaterialThumbnail = (
  fileType?: string,
  resolvedTheme?: 'light' | 'dark'
) => {
  const type = fileType?.split('/').pop()?.toLowerCase().trim();
  const mappedType = type ? FILE_TYPE_MAP[type] || type : null;
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const isSupported = mappedType && FILE_TYPE_THUMBNAILS.includes(mappedType);

  if (!isSupported) {
    return '/material.svg';
  }

  return `/${mappedType}-${theme}.svg`;
};

interface MaterialFavouriteCardProps {
  material: FavouriteMaterial;
  index: number;
  resolvedTheme: 'light' | 'dark';
  activeMenuId: string | null;
  onMenuToggle: (id: string | null) => void;
  onToggleFavourite: (payload: {
    entity_type: 'material';
    entity_id: string;
    is_favourite: boolean;
  }) => void;
}

const MaterialFavouriteCard = ({
  material,
  index,
  resolvedTheme,
  activeMenuId,
  onMenuToggle,
  onToggleFavourite,
}: MaterialFavouriteCardProps) => {
  const handleDownload = () => {
    if (material?.file?.download_url) {
      window.open(material.file.download_url, '_blank', 'noreferrer');
    }
  };

  return (
    <div onClick={handleDownload} className="block cursor-pointer group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex flex-row items-center gap-3 p-2 rounded-lg bg-(--color-bg-secondary) transition-colors"
      >
        {/* Icon */}
        <div className="w-28 aspect-video flex items-center justify-center shrink-0 rounded-md bg-(--color-bg-tertiary)">
          <Image
            src={getMaterialThumbnail(material?.file?.extension, resolvedTheme)}
            alt={material?.file?.type}
            width={30}
            height={30}
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <h3 className="Body-Small font-medium text-(--color-text-primary) mb-1 truncate">
            {material?.title || ''}
          </h3>

          <div className="Caption-Small text-(--color-text-tertiary) mb-1.5 flex items-center gap-2">
            <span>{material?.file?.type || ''}</span>
            <span className="w-1 h-1 rounded-full bg-(--color-text-tertiary)" />
            <span>{material?.file?.size_kb || 0} KB</span>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold text-(--color-text-secondary) border border-(--color-border-medium) rounded">
              {material?.paper?.code || ''}
            </span>

            <span className="Caption-Small text-(--color-text-secondary) truncate">
              {material?.chapter?.title || ''}
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
                entity_type: 'material',
                entity_id: material?.material_id,
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
                  activeMenuId === material?.material_id
                    ? null
                    : material?.material_id
                )
              }
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                activeMenuId === material?.material_id
                  ? 'bg-(--color-bg-tertiary) text-(--color-text-primary)'
                  : 'text-(--color-text-tertiary) hover:bg-(--color-bg-tertiary)'
              }`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {activeMenuId === material?.material_id && (
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
                      handleDownload();
                    }}
                    className="w-full text-left px-2 py-2 Body-Small text-(--color-text-primary) border-b border-(--color-border-light) cursor-pointer hover:bg-(--color-bg-tertiary) rounded-md transition-colors"
                  >
                    Download material
                  </button>

                  <button
                    onClick={() => {
                      onToggleFavourite({
                        entity_type: 'material',
                        entity_id: material?.material_id,
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

export default MaterialFavouriteCard;
