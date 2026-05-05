import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNotes } from '@/hooks/useNotes';
import type { Note } from '@/types/note.types';
import Image from 'next/image';
import DeleteNoteModal from '@/components/modals/DeleteNoteModal';
import AddEditNoteModal from '@/components/modals/AddEditNoteModal';

interface NotesProps {
  videoId: string;
}

const Notes = ({ videoId }: NotesProps) => {
  const { notes, isLoading, createNote, updateNote, deleteNote } =
    useNotes(videoId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNewNote(note.content);
    } else {
      setEditingNote(null);
      setNewNote('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!videoId || !newNote.trim()) return;

    if (editingNote) {
      updateNote.mutate({
        _id: editingNote._id,
        video_id: videoId,
        time: editingNote.time,
        content: newNote,
      });
    } else {
      createNote.mutate({
        video_id: videoId,
        time: '0:00',
        content: newNote,
      });
    }

    setIsModalOpen(false);
    setNewNote('');
    setEditingNote(null);
  };

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote.mutate({ _id: noteToDelete });
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar pb-24 scrollbar-hide">
        <div className="flex flex-col flex-1 h-full">
          {isLoading ? (
            <div className="flex flex-col">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-4 border-b border-(--color-border-light) last:border-0 animate-pulse"
                >
                  {/* Timestamp pill + content */}
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-12 rounded-full bg-(--color-bg-tertiary) shrink-0" />

                    <div className="flex-1 flex flex-col gap-2 pt-0.5">
                      <div className="h-3.5 w-full rounded bg-(--color-bg-tertiary)" />
                      <div className="h-3.5 w-4/5 rounded bg-(--color-bg-tertiary)" />
                    </div>
                  </div>

                  {/* Edit / Delete buttons */}
                  <div className="flex items-center gap-4 pl-14">
                    <div className="h-3 w-10 rounded bg-(--color-bg-tertiary)" />
                    <div className="h-3 w-12 rounded bg-(--color-bg-tertiary)" />
                  </div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
              <Image
                src="/empty-notes.svg"
                alt="No notes"
                width={60}
                height={60}
                className="opacity-90"
              />

              <div className="flex flex-col items-center gap-1.5 mt-2">
                <h3 className="Heading-4 text-(--color-text-primary)">
                  No Notes Yet
                </h3>

                <p className="Body-Small text-(--color-text-tertiary) text-center max-w-xs">
                  Create notes while watching lessons to revise faster later.
                </p>
              </div>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note?._id}
                className="group flex flex-col gap-3 p-4 border-b border-(--color-border-light) last:border-0"
              >
                <div className="flex items-start gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-(--color-bg-tertiary) Overline text-(--color-text-primary)">
                    {note?.time || '0:00'}
                  </span>

                  <p className="Body-Small text-(--color-text-primary) pt-0.5">
                    {note?.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 pl-14">
                  <button
                    onClick={() => handleOpenModal(note)}
                    className="flex items-center gap-1.5 Caption text-(--color-primary-500) cursor-pointer"
                  >
                    <Image
                      src="/draw-pencil.svg"
                      alt="Edit"
                      width={14}
                      height={14}
                    />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteClick(note._id)}
                    className="flex items-center gap-1.5 Caption text-(--color-error-600) cursor-pointer"
                  >
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
            ))
          )}
        </div>
      </div>

      {/* Mobile Button */}
      {createPortal(
        <div className="fixed bottom-16 left-0 right-0 z-50 p-4 lg:hidden">
          <button
            onClick={() => handleOpenModal()}
            className="w-full py-3 px-4 bg-(--color-primary-500) text-white Button-Primary rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            Add New Note
          </button>
        </div>,
        document.body
      )}

      {/* Desktop Button */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-4 z-10">
        <button
          onClick={() => handleOpenModal()}
          className="w-full py-2.5 px-3 bg-(--color-primary-500) text-white Button-Primary rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          Add New Note
        </button>
      </div>

      {/* Add / Edit Note Modal */}
      <AddEditNoteModal
        isOpen={isModalOpen}
        editingNote={editingNote}
        noteContent={newNote}
        isSaving={createNote.isPending || updateNote.isPending}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onContentChange={setNewNote}
        onSave={handleSave}
      />

      {/* Delete Note Modal Overlay */}
      <DeleteNoteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={confirmDelete}
        isDeleting={deleteNote.isPending}
      />
    </div>
  );
};

export default Notes;
