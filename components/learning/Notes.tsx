import React from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: number;
  timestamp: string;
  content: string;
}

const notes: Note[] = [
  {
    id: 1,
    timestamp: '0:21',
    content: 'Depreciation Formula Sheet',
  },
  {
    id: 2,
    timestamp: '0:21',
    content: 'Depreciation Formula Sheet',
  },
  {
    id: 3,
    timestamp: '0:21',
    content: 'Depreciation Formula Sheet',
  },
  {
    id: 4,
    timestamp: '0:21',
    content: 'Depreciation Formula Sheet',
  },
];

const Notes = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newNote, setNewNote] = React.useState('Depreciation Formula Sheet');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-24 scrollbar-hide">
        <div className="flex flex-col">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group flex flex-col gap-3 p-4 border-b border-(--color-border-light) last:border-0"
            >
              <div className="flex items-start gap-3">
                <span className="px-2.5 py-1 rounded-full bg-(--color-bg-tertiary) Overline text-(--color-text-primary)">
                  {note.timestamp}
                </span>

                <p className="Body-Small text-(--color-text-primary) pt-0.5">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center gap-4 pl-14">
                <button className="flex items-center gap-1.5 Caption text-(--color-primary-500) cursor-pointer">
                  <Image
                    src="/draw-pencil.svg"
                    alt="Edit"
                    width={14}
                    height={14}
                  />
                  Edit
                </button>

                <button className="flex items-center gap-1.5 Caption text-(--color-error-600) cursor-pointer">
                  <Image
                    src="/delete.svg"
                    alt="Delete"
                    width={14}
                    height={14}
                  />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Button (Fixed to Viewport) */}
      {createPortal(
        <div className="fixed bottom-16 left-0 right-0 z-50 p-4 lg:hidden">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-4 bg-(--color-primary-500) text-white Button-Primary rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            Add New Note
          </button>
        </div>,
        document.body
      )}

      {/* Desktop Button (Absolute to Column) */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-4 z-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 px-4 bg-(--color-primary-500) text-white Button-Primary rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          Add New Note
        </button>
      </div>

      {/* Add Note Modal Overlay */}
      {/* Add Note Modal Overlay */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsModalOpen(false);
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
                {/* Header/Timestamp */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-(--color-bg-tertiary) Overline text-(--color-text-primary)">
                    0:21
                  </span>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-(--color-text-disabled) hover:text-(--color-text-primary) cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Input Area */}
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full text-base Body-Small text-(--color-text-primary) focus:outline-hidden resize-none bg-transparent"
                  placeholder="Type your note here..."
                  rows={3}
                  autoFocus
                />

                {/* Save Button */}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewNote('');
                  }}
                  className="w-full py-3 bg-(--color-primary-500) text-(--color-white) Button-Primary rounded-xl cursor-pointer"
                >
                  Save Note
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Notes;
