import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  // Shown beside the label, e.g. the paper a chapter belongs to
  hint?: string;
}

interface FilterModalProps {
  type: string;
  options: FilterOption[];
  selectedValues: string[];
  isLoading?: boolean;
  onClose: () => void;
  onApply: (selected: string[]) => void;
}

const FilterModal = ({
  type,
  options,
  selectedValues,
  isLoading = false,
  onClose,
  onApply,
}: FilterModalProps) => {
  const [localSearch, setLocalSearch] = useState('');
  const [tempSelected, setTempSelected] = useState<string[]>(selectedValues);

  const searchTerm = localSearch.trim().toLowerCase();
  const filteredList = searchTerm
    ? options.filter((option) =>
        `${option.label} ${option.hint ?? ''}`
          .toLowerCase()
          .includes(searchTerm)
      )
    : options;

  const toggleSelection = (item: string) => {
    setTempSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-end md:items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-(--color-bg-primary) rounded-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Modal Header */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-primary)" />
            <input
              type="text"
              placeholder={`Search ${type.toLowerCase()}`}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-(--color-bg-secondary) border border-(--color-border-medium) rounded-full text-sm text-(--color-text-primary) focus:outline-none"
            />

            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-tertiary) hover:text-(--color-text-primary) cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2">
          {filteredList.map((option) => {
            const isSelected = tempSelected.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => toggleSelection(option.value)}
                className="flex items-center gap-3 p-3 border-b border-(--color-border-light) last:border-none cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-(--color-primary-500) border-(--color-primary-500)'
                      : 'border-(--color-border-medium) bg-(--color-bg-primary)'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>

                <span className="Body-Extra-Small text-(--color-text-primary) flex-1 min-w-0 truncate">
                  {option.label}
                </span>

                {option.hint && (
                  <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold text-(--color-text-secondary) border border-(--color-border-medium) rounded shrink-0">
                    {option.hint}
                  </span>
                )}
              </div>
            );
          })}

          {filteredList.length === 0 && (
            <div className="p-4 text-center text-sm text-(--color-text-tertiary)">
              {isLoading ? 'Loading...' : 'No results found'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 Button-Small text-(--color-text-primary) border border-(--color-border-medium) rounded-lg cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => onApply(tempSelected)}
            className="flex-1 py-2.5 Button-Small text-white bg-(--color-primary-500) rounded-lg cursor-pointer"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default FilterModal;
