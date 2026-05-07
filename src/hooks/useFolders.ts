import { useEffect, useCallback } from 'react';
import { useFolderStore } from '../store/folderStore';
import { FolderQueries } from '../database/queries';

export const useFolders = () => {
  const { setFolders } = useFolderStore();

  const loadFolders = useCallback(async () => {
    try {
      const folders = await FolderQueries.getFolders();
      setFolders(folders);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  }, [setFolders]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  return { loadFolders };
};
