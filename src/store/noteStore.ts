import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string | null;
  images_json: string | null;
  tags_json: string | null;
  color: string;
  is_locked: number;
  is_pinned: number;
  reminder_at: number | null;
  reminder_type: string | null;
  folder_id: string | null;
  created_at: number;
  updated_at: number;
}

interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  searchQuery: string;
  filterFolderId: string | null;
  viewMode: 'grid' | 'list';
  setNotes: (notes: Note[]) => void;
  setSelectedNote: (note: Note | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilterFolderId: (id: string | null) => void;
  toggleViewMode: () => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  selectedNote: null,
  isLoading: false,
  searchQuery: '',
  filterFolderId: null,
  viewMode: 'grid',
  setNotes: (notes) => set({ notes }),
  setSelectedNote: (note) => set({ selectedNote: note }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterFolderId: (filterFolderId) => set({ filterFolderId }),
  toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === 'grid' ? 'list' : 'grid' })),
}));
