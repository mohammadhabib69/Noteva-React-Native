import { useEffect, useCallback } from 'react';
import { useNoteStore, Note } from '../store/noteStore';
import { NoteQueries } from '../database/queries';

export const useNotes = () => {
  const { setNotes, setIsLoading, filterFolderId, searchQuery } = useNoteStore();

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const notes = await NoteQueries.getNotes(filterFolderId);
      // Filter by search query if exists
      const filteredNotes = searchQuery 
        ? notes.filter(n => 
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            n.content?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : notes;
      setNotes(filteredNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterFolderId, searchQuery, setNotes, setIsLoading]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return { loadNotes };
};
