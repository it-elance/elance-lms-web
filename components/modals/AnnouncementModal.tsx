'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { Announcement } from '@/types/home.types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement;
}

const AnnouncementModal = ({
  isOpen,
  onClose,
  announcement,
}: AnnouncementModalProps) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const formattedDate = announcement.published_at
    ? new Date(announcement.published_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-99999 w-screen h-screen flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 w-full h-full bg-black/50"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-125 bg-(--color-bg-secondary) rounded-2xl p-4 flex flex-col shadow-xl outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            {announcement?.image_url ? (
              <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden mb-4 border border-(--color-border-light)">
                <Image
                  src={announcement?.image_url}
                  alt={announcement?.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-48 sm:h-56 rounded-xl bg-(--color-bg-tertiary) mb-4 flex items-center justify-center border border-(--color-border-light)">
                <span className="text-(--color-text-disabled)">
                  {announcement?.category}
                </span>
              </div>
            )}

            {/* Content Section */}
            <div className="flex flex-col flex-1 px-1">
              <div className="flex flex-col gap-3 mb-4">
                {formattedDate && (
                  <p className="text-(--color-text-secondary) Body-Small">
                    Post Date: {formattedDate}
                  </p>
                )}

                {announcement?.category && (
                  <div>
                    <span className="inline-block bg-(--color-warning-100) text-(--color-warning-600) Caption-Small px-2.5 py-1 rounded">
                      {announcement?.category}
                    </span>
                  </div>
                )}
              </div>

              {announcement?.title && (
                <h3 className="Heading-5 text-(--color-text-primary) mb-2">
                  {announcement?.title}
                </h3>
              )}

              <div className="text-(--color-text-secondary) Body-Medium whitespace-pre-wrap mb-6">
                {announcement?.description}
              </div>

              <div className="mt-auto pt-2">
                <button
                  onClick={onClose}
                  className="w-full bg-(--color-primary-500) hover:bg-(--color-primary-600) text-white py-3 rounded-xl transition-colors font-medium Button-Primary cursor-pointer"
                >
                  Go to Page
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AnnouncementModal;
