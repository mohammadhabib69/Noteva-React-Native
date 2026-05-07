import { create } from 'zustand';

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: number;
}

interface FolderState {
  folders: Folder[];
  activeFolderId: string | null;
  setFolders: (folders: Folder[]) => void;
  setActiveFolderId: (id: string | null) => void;
}

export const useFolderStore = create<FolderState>((set) => ({
  folders: [],
  activeFolderId: null,
  setFolders: (folders) => set({ folders }),
  setActiveFolderId: (id) => set({ activeFolderId: id }),
}));
