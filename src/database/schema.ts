import * as SQLite from 'expo-sqlite';

export const DATABASE_NAME = 'noteva.db';

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '📁',
      color TEXT DEFAULT '#FF5252',
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      content TEXT,
      images_json TEXT,
      tags_json TEXT,
      color TEXT DEFAULT '#FF5252',
      is_locked INTEGER DEFAULT 0,
      is_pinned INTEGER DEFAULT 0,
      reminder_at INTEGER,
      reminder_type TEXT,
      folder_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
    CREATE INDEX IF NOT EXISTS idx_notes_is_locked ON notes(is_locked);
    CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON notes(folder_id);
  `);

  return db;
};
