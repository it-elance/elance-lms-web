'use client';

import { motion } from 'framer-motion';
import { Check, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

const Theme = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const options = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Device default settings', value: 'system' },
  ];

  const handleSelect = (val: 'light' | 'dark' | 'system') => {
    setTheme(val);
  };

  return (
    <div className="flex flex-col min-h-full w-full relative">
      <div className="sticky top-0 z-10 w-full flex justify-start pointer-events-none bg-(--color-bg-primary) py-4">
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

        <div className="flex items-center justify-center relative w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="Heading-3 text-(--color-text-primary)"
          >
            Theme Preferences
          </motion.h1>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 pb-6 mt-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-(--color-bg-secondary) rounded-xl overflow-hidden border border-(--color-border-light)"
        >
          {options.map((option, index) => (
            <div key={option.value}>
              <button
                onClick={() =>
                  handleSelect(option.value as 'light' | 'dark' | 'system')
                }
                className="w-full flex items-center justify-between p-5 transition-colors text-left cursor-pointer"
              >
                <span className="text-(--color-text-primary) Body-Small">
                  {option.label}
                </span>

                {theme === option.value && (
                  <Check
                    className="text-(--color-primary-500)"
                    size={20}
                    strokeWidth={2.5}
                  />
                )}
              </button>

              {index !== options.length - 1 && (
                <div className="mx-5 border-b border-(--color-border-light)" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Theme;
