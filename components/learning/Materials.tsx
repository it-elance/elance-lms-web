import Image from 'next/image';
import { useMemo } from 'react';
import { useMaterials } from '@/hooks/useMaterials';
import { useFavourite } from '@/hooks/useFavourite';
import { useTheme } from '@/components/ThemeProvider';
import type { FavouritePayload } from '@/types/favourite.types';
import type { Material } from '@/types/material.types';

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

interface MaterialsProps {
  lectureId: string | null | undefined;
}

const Materials = ({ lectureId }: MaterialsProps) => {
  const { materials, isLoading } = useMaterials(lectureId);
  const { toggleFavourite, isTogglingFavourite } = useFavourite();

  const { resolvedTheme } = useTheme();

  const topicMaterials = useMemo(
    () => materials.filter((material) => material.type === 'lecture'),
    [materials]
  );

  const chapterMaterials = useMemo(
    () => materials.filter((material) => material.type === 'chapter'),
    [materials]
  );

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col gap-4">
          {/* Topic Materials skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-(--color-bg-tertiary) rounded animate-pulse" />

            {[1, 2].map((i) => (
              <SkeletonCard key={`topic-${i}`} />
            ))}
          </div>

          {/* Chapter Resources skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-36 bg-(--color-bg-tertiary) rounded animate-pulse" />

            {[1, 2, 3].map((i) => (
              <SkeletonCard key={`chapter-${i}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full gap-3">
        <Image
          src="/empty-materials.svg"
          alt="No notes"
          width={90}
          height={90}
          className="opacity-90"
        />

        <div className="flex flex-col items-center gap-1.5 mt-2">
          <h3 className="Heading-4 text-(--color-text-primary)">
            No Materials Available
          </h3>

          <p className="Body-Small text-(--color-text-tertiary) text-center max-w-xs">
            Study materials for this topic or chapter haven&apos;t been uploaded
            yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex flex-col gap-4">
        {topicMaterials.length > 0 && (
          <MaterialSection
            title="Topic Materials"
            materials={topicMaterials}
            resolvedTheme={resolvedTheme}
            lectureId={lectureId}
            isTogglingFavourite={isTogglingFavourite}
            onToggleFavourite={toggleFavourite}
          />
        )}

        {chapterMaterials.length > 0 && (
          <MaterialSection
            title="Chapter Resources"
            materials={chapterMaterials}
            resolvedTheme={resolvedTheme}
            lectureId={lectureId}
            isTogglingFavourite={isTogglingFavourite}
            onToggleFavourite={toggleFavourite}
          />
        )}
      </div>
    </div>
  );
};

export default Materials;

type ToggleFavouriteHandler = (
  payload: FavouritePayload & {
    lectureId?: string | null;
  }
) => void;

const MaterialSection = ({
  title,
  materials,
  resolvedTheme,
  lectureId,
  isTogglingFavourite,
  onToggleFavourite,
}: {
  title: string;
  materials: Material[];
  resolvedTheme?: 'light' | 'dark';
  lectureId: string | null | undefined;
  isTogglingFavourite: boolean;
  onToggleFavourite: ToggleFavouriteHandler;
}) => (
  <div className="flex flex-col gap-2">
    <h3 className="Caption-Medium text-(--color-text-secondary)">{title}</h3>

    {materials.map((material) => (
      <MaterialCard
        key={material.material_id}
        material={material}
        resolvedTheme={resolvedTheme}
        lectureId={lectureId}
        isTogglingFavourite={isTogglingFavourite}
        onToggleFavourite={onToggleFavourite}
      />
    ))}
  </div>
);

const MaterialCard = ({
  material,
  resolvedTheme,
  lectureId,
  isTogglingFavourite,
  onToggleFavourite,
}: {
  material: Material;
  resolvedTheme?: 'light' | 'dark';
  lectureId: string | null | undefined;
  isTogglingFavourite: boolean;
  onToggleFavourite: ToggleFavouriteHandler;
}) => (
  <a
    href={material?.file_url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Open ${material?.title}`}
    className="flex items-center justify-between p-2 rounded-xl bg-(--color-bg-secondary) cursor-pointer group hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center gap-3 overflow-hidden">
      {/* Icon */}
      <div className="w-22 h-14 flex items-center justify-center shrink-0 rounded-md bg-(--color-bg-tertiary)">
        <Image
          src={getMaterialThumbnail(material?.file_type, resolvedTheme)}
          alt={material?.file_type?.toUpperCase()}
          width={25}
          height={25}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        {/* title */}
        <h4 className="Body-Small text-(--color-text-primary) truncate pr-4">
          {material?.title}
        </h4>

        <p className="Caption-Small text-(--color-text-tertiary) flex items-center gap-2 mt-1.5">
          {/* file type */}
          <span>{material?.file_type?.toUpperCase()}</span>

          <span className="w-1 h-1 rounded-full bg-(--color-text-tertiary)" />

          {/* file size */}
          <span>{material?.file_size}</span>
        </p>
      </div>
    </div>

    {/* Favourite */}
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        aria-label={
          material?.is_favourite
            ? 'Remove from favourites'
            : 'Add to favourites'
        }
        disabled={isTogglingFavourite}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          onToggleFavourite({
            entity_type: 'material',
            entity_id: material?.material_id,
            is_favourite: !material?.is_favourite,
            lectureId,
          });
        }}
        className={`cursor-pointer transition-colors ${
          material?.is_favourite
            ? 'text-(--color-primary-500)'
            : 'text-(--color-text-tertiary)'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <SvgIcon
          src={material?.is_favourite ? '/heart-filled.svg' : '/heart.svg'}
          className="w-5 h-5 bg-current"
        />
      </button>
    </div>
  </a>
);

const SkeletonCard = () => (
  <div className="flex items-center justify-between p-2 rounded-xl bg-(--color-bg-secondary) animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-22.5 h-22.5 bg-(--color-bg-tertiary) rounded-md shrink-0" />

      <div className="flex flex-col gap-2">
        <div className="h-4 w-48 bg-(--color-bg-tertiary) rounded" />

        <div className="flex items-center gap-2 mt-1">
          <div className="h-3 w-10 bg-(--color-bg-tertiary) rounded" />

          <div className="w-1 h-1 rounded-full bg-(--color-bg-tertiary)" />

          <div className="h-3 w-14 bg-(--color-bg-tertiary) rounded" />
        </div>
      </div>
    </div>

    <div className="w-5 h-5 bg-(--color-bg-tertiary) rounded-full shrink-0" />
  </div>
);

const SvgIcon = ({
  src,
  className = '',
}: {
  src: string;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
      backgroundColor: 'currentColor',
    }}
  />
);
