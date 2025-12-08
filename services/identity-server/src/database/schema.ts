import { Database } from 'better-sqlite3';

export function initializeSchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT DEFAULT (lower(hex(randomblob(16)))),
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT DEFAULT NULL,
      password TEXT DEFAULT NULL,
      avatar TEXT DEFAULT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      updated_at INTEGER DEFAULT (strftime('%s','now')),
      last_login INTEGER DEFAULT (strftime('%s','now')),
      last_logout INTEGER DEFAULT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      provider TEXT DEFAULT 'local',
      token_id TEXT DEFAULT '',
      bio TEXT DEFAULT ''
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tfa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      secret TEXT NOT NULL,
      enabled BOOLEAN DEFAULT FALSE,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}
