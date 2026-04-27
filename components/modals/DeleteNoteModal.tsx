'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteNoteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteNoteModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
            className="absolute inset-0 bg-black/20"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-(--color-bg-primary) w-full max-w-sm p-6 rounded-xl shadow-lg border border-(--color-border) flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <h3 className="Heading-6 text-(--color-text-primary)">
                Delete Note
              </h3>

              <p className="Body-Small text-(--color-text-secondary)">
                Are you sure you want to delete this note? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl border border-(--color-border) text-(--color-text-primary) Button-Secondary cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-3 rounded-xl bg-(--color-error-600) text-white Button-Primary cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DeleteNoteModal;
