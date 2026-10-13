'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';
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
        <div className="fixed inset-0 z-99999 w-full h-dvh flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 w-full h-full bg-black/50"
          />

          {/* Modal Content: never taller than the screen. The image and text
              scroll inside it, so the close button stays in view */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={announcement?.title}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-125 max-h-full bg-(--color-bg-secondary) rounded-2xl flex flex-col shadow-xl outline-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* In its own row, so it never covers text in the image */}
            <div className="shrink-0 flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="h-8 w-8 rounded-full flex items-center justify-center bg-(--color-bg-primary) border border-(--color-border) text-(--color-text-secondary) hover:text-(--color-text-primary) cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-2 pb-5">
              {/* Image Section: the whole image, never cropped, so text in it
                  stays readable */}
              {announcement?.image_url ? (
                <div className="w-full rounded-xl overflow-hidden mb-4 border border-(--color-border-light) bg-(--color-bg-tertiary)">
                  <Image
                    src={announcement?.image_url}
                    alt={announcement?.title}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, 500px"
                    className="w-full h-auto max-h-[45dvh] object-contain"
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
              <div className="flex flex-col px-1">
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
                  <h3 className="Heading-5 text-(--color-text-primary) mb-2 wrap-break-word">
                    {announcement?.title}
                  </h3>
                )}

                <div className="text-(--color-text-secondary) Body-Medium whitespace-pre-wrap wrap-break-word">
                  {announcement?.description}
                </div>
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
