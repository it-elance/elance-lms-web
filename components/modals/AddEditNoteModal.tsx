'use client';

import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Note } from '@/types/note.types';

interface AddEditNoteModalProps {
  isOpen: boolean;
  editingNote: Note | null;
  noteContent: string;
  isSaving: boolean;
  onClose: () => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
}

const AddEditNoteModal = ({
  isOpen,
  editingNote,
  noteContent,
  isSaving,
  onClose,
  onContentChange,
  onSave,
}: AddEditNoteModalProps) => {
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
            {/* Header / Timestamp */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-(--color-bg-tertiary) Overline text-(--color-text-primary)">
                {editingNote ? editingNote.time : '0:00'}
              </span>

              <button
                onClick={onClose}
                className="text-(--color-text-disabled) hover:text-(--color-text-primary) cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Input Area */}
            <textarea
              value={noteContent}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full text-base Body-Small text-(--color-text-primary) focus:outline-hidden resize-none bg-transparent"
              placeholder="Type your note here..."
              rows={3}
              autoFocus
            />

            {/* Save Button */}
            <button
              onClick={onSave}
              disabled={isSaving}
              className="w-full py-2.5 bg-(--color-primary-500) text-white Button-Primary rounded-xl cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddEditNoteModal;
