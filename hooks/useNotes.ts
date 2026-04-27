'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotesApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
} from '@/services/api.service';
import type { Note } from '@/types/note.types';

export const NOTES_QUERY_KEY = (videoId: string) =>
  ['notes', { videoId }] as const;

export const useNotes = (videoId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Note[]>({
    queryKey: NOTES_QUERY_KEY(videoId),
    queryFn: () => getNotesApi(videoId),
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5,
  });

  const createNote = useMutation({
    mutationFn: createNoteApi,
    onSuccess: (newNote) => {
      const noteToInsert = newNote?.data ? newNote.data : newNote;
      queryClient.setQueryData(NOTES_QUERY_KEY(videoId), (old: Note[] = []) => [
        noteToInsert,
        ...old,
      ]);
    },
  });

  const updateNote = useMutation({
    mutationFn: updateNoteApi,
    onSuccess: (updatedNote) => {
      const noteToUpdate = updatedNote?.data ? updatedNote.data : updatedNote;
      queryClient.setQueryData(NOTES_QUERY_KEY(videoId), (old: Note[] = []) =>
        old.map((n) => (n._id === noteToUpdate._id ? noteToUpdate : n))
      );
    },
  });

  const deleteNote = useMutation({
    mutationFn: deleteNoteApi,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(NOTES_QUERY_KEY(videoId), (old: Note[] = []) =>
        old.filter((n) => n._id !== variables._id)
      );
    },
  });

  return {
    notes: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    createNote,
    updateNote,
    deleteNote,
  };
};
