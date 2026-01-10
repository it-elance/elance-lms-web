import { useState } from 'react';
import Image from 'next/image';

interface Material {
  id: number;
  title: string;
  type: 'PDF' | 'PPT' | 'JPG' | 'DOCX' | 'XLS';
  size: string;
}

const materials: Material[] = [
  {
    id: 1,
    title: 'Depreciation Formula Sheet',
    type: 'PDF',
    size: '840 KB',
  },
  {
    id: 2,
    title: 'Understanding Different Types of Organizations',
    type: 'PPT',
    size: '840 KB',
  },
  {
    id: 3,
    title: 'Organizational Structures',
    type: 'JPG',
    size: '840 KB',
  },
  {
    id: 4,
    title: 'Understanding Different Types of Organizations',
    type: 'DOCX',
    size: '840 KB',
  },
  {
    id: 5,
    title: 'Types of organizations',
    type: 'XLS',
    size: '840 KB',
  },
];

const Materials = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex flex-col gap-2">
        {materials.map((material) => {
          const isFavorite = favorites.includes(material.id);
          return (
            <div
              key={material.id}
              className="flex items-center justify-between p-2 rounded-xl border border-transparent bg-(--color-bg-secondary) cursor-pointer group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Icon Container */}
                <div className="flex items-center justify-center shrink-0">
                  <Image
                    src="/material.svg"
                    alt="Material"
                    width={90}
                    height={90}
                  />
                </div>

                {/* Text Info */}
                <div className="flex flex-col min-w-0">
                  <h4 className="Body-Small text-(--color-text-primary) truncate pr-4">
                    {material.title}
                  </h4>

                  <p className="Caption-Small text-(--color-text-tertiary) flex items-center gap-2 mt-2">
                    <span>{material.type}</span>
                    <span className="w-1 h-1 rounded-full bg-(--color-text-tertiary)"></span>
                    <span>{material.size}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleFavorite(material.id)}
                  className={`cursor-pointer transition-colors ${
                    isFavorite
                      ? 'text-(--color-primary-500)'
                      : 'text-(--color-text-tertiary)'
                  }`}
                >
                  <SvgIcon
                    src={isFavorite ? '/heart-filled.svg' : '/heart.svg'}
                    className="w-5 h-5 bg-current"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Materials;

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
    }}
  />
);
