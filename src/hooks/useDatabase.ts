import { useEffect, useState } from 'react';
import { initDatabase } from '../database/schema';
import { FolderQueries } from '../database/queries';

export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        await FolderQueries.seedFolders();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    setup();
  }, []);

  return isReady;
};
