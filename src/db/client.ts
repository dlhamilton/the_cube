import * as SQLite from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export type AppDatabase = ExpoSQLiteDatabase<typeof schema>;

let db: AppDatabase | null = null;
let sqliteDb: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (db) return db;

  sqliteDb = await SQLite.openDatabaseAsync('the_cube.db');

  // Run migrations inline (no drizzle-kit push needed at runtime)
  await sqliteDb.execAsync(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cube_size INTEGER NOT NULL,
      total_cubes INTEGER NOT NULL,
      cubes_remaining INTEGER NOT NULL,
      prizes_won INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      completed_at TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL REFERENCES games(id),
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      z INTEGER NOT NULL,
      is_winner INTEGER NOT NULL DEFAULT 0,
      prize_name TEXT,
      clicked_at TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    );
  `);

  db = drizzle(sqliteDb, { schema });
  return db;
}
