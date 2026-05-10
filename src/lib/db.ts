import Database from 'better-sqlite3';
import path from 'path';

let dbInstance: any = null;

export function getDb() {
  if (!dbInstance) {
    const dbPath = path.resolve(process.cwd(), 'traveloop.db');
    dbInstance = new Database(dbPath);
    // Enable foreign keys in SQLite
    dbInstance.pragma('foreign_keys = ON');
    // Add compatibility layer for the .execute pattern used in server.ts
    dbInstance.execute = async (sql: string, params: any[] = []) => {
      try {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const rows = dbInstance.prepare(sql).all(...params);
          return [rows];
        } else {
          const result = dbInstance.prepare(sql).run(...params);
          return [{ 
            insertId: Number(result.lastInsertRowid), 
            affectedRows: result.changes 
          }];
        }
      } catch (error) {
        console.error(`DB Execute Error [${sql}]:`, error);
        throw error;
      }
    };
  }
  return dbInstance;
}

export async function initDatabase() {
  const db = getDb();
  
  // SQLite specific adjustments: AUTO_INCREMENT -> AUTOINCREMENT, TIMESTAMP/DATETIME
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      emoji TEXT DEFAULT '🌍',
      status TEXT CHECK(status IN ('planning', 'upcoming', 'completed')) DEFAULT 'planning',
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS itinerary_days (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       trip_id INTEGER NOT NULL,
       day_number INTEGER NOT NULL,
       date TEXT,
       city TEXT,
       FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      day_id INTEGER NOT NULL,
      time TEXT,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('travel', 'sightseeing', 'food', 'experience', 'culture')),
      cost REAL DEFAULT 0,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
      FOREIGN KEY (day_id) REFERENCES itinerary_days(id) ON DELETE CASCADE
    )
  `).run();

  console.log('SQL Database initialized and ready.');
}
