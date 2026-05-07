import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from './schema';
import { Note } from '../store/noteStore';
import { Folder } from '../store/folderStore';

const getDb = async () => await SQLite.openDatabaseAsync(DATABASE_NAME);

export const NoteQueries = {
  getNotes: async (folderId: string | null = null): Promise<Note[]> => {
    const db = await getDb();
    let query = 'SELECT * FROM notes ORDER BY is_pinned DESC, updated_at DESC';
    let params: any[] = [];
    
    if (folderId) {
      query = 'SELECT * FROM notes WHERE folder_id = ? ORDER BY is_pinned DESC, updated_at DESC';
      params = [folderId];
    }
    
    const results = await db.getAllAsync(query, ...params);
    return results as Note[];
  },

  getNoteById: async (id: string): Promise<Note | null> => {
    const db = await getDb();
    const result = await db.getFirstAsync('SELECT * FROM notes WHERE id = ?', id);
    return result as Note | null;
  },

  upsertNote: async (note: Partial<Note>): Promise<void> => {
    const db = await getDb();
    const now = Date.now();
    
    if (note.id) {
      // Update
      await db.runAsync(
        `UPDATE notes SET 
          title = ?, content = ?, images_json = ?, tags_json = ?, 
          color = ?, is_locked = ?, is_pinned = ?, reminder_at = ?, 
          reminder_type = ?, folder_id = ?, updated_at = ? 
        WHERE id = ?`,
        note.title || '', note.content || '', note.images_json || '[]', note.tags_json || '[]',
        note.color || '#FF5252', note.is_locked || 0, note.is_pinned || 0, 
        note.reminder_at || null, note.reminder_type || null, note.folder_id || null, 
        now, note.id
      );
    } else {
      // Insert
      const id = Math.random().toString(36).substring(7); // Simple UUID
      await db.runAsync(
        `INSERT INTO notes (
          id, title, content, images_json, tags_json, color, 
          is_locked, is_pinned, reminder_at, reminder_type, 
          folder_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id, note.title || '', note.content || '', note.images_json || '[]', 
        note.tags_json || '[]', note.color || '#FF5252', note.is_locked || 0, 
        note.is_pinned || 0, note.reminder_at || null, note.reminder_type || null, 
        note.folder_id || null, now, now
      );
    }
  },

  deleteNote: async (id: string): Promise<void> => {
    const db = await getDb();
    await db.runAsync('DELETE FROM notes WHERE id = ?', id);
  }
};

export const FolderQueries = {
  getFolders: async (): Promise<Folder[]> => {
    const db = await getDb();
    const results = await db.getAllAsync('SELECT * FROM folders ORDER BY sort_order ASC');
    return results as Folder[];
  },

  createFolder: async (name: string, icon: string = '📁', color: string = '#FF5252'): Promise<void> => {
    const db = await getDb();
    const id = Math.random().toString(36).substring(7);
    const now = Date.now();
    await db.runAsync(
      'INSERT INTO folders (id, name, icon, color, created_at) VALUES (?, ?, ?, ?, ?)',
      id, name, icon, color, now
    );
  },

  seedFolders: async (): Promise<void> => {
    const db = await getDb();
    const count = await db.getFirstAsync('SELECT COUNT(*) as count FROM folders');
    if ((count as any).count === 0) {
      await FolderQueries.createFolder('Work', '💼', '#FF5252');
      await FolderQueries.createFolder('Personal', '🏠', '#f5f5f5');
      await FolderQueries.createFolder('Ideas', '💡', '#cc3d3d');
    }
  }
};
