import { Database } from 'better-sqlite3'

export function initializeSchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT DEFAULT (lower(hex(randomblob(16)))),
      username TEXT UNIQUE,
      email TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT DEFAULT NULL,
      password TEXT DEFAULT NULL,
      avatar TEXT DEFAULT NULL,
      bio TEXT DEFAULT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      updated_at INTEGER DEFAULT (strftime('%s','now')),
      last_login INTEGER DEFAULT (strftime('%s','now')),
      last_logout INTEGER DEFAULT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      provider TEXT DEFAULT NULL,
      token_id TEXT DEFAULT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS connections (
      user_id INTEGER NOT NULL,
      provider TEXT NOT NULL,
      provider_user_id TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      PRIMARY KEY (user_id, provider)
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
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS friendships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      status INTEGER NOT NULL DEFAULT 0 CHECK(status IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),

      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(sender_id, receiver_id)
    );

    CREATE INDEX IF NOT EXISTS idx_sender_status ON friendships(sender_id, status);
    CREATE INDEX IF NOT EXISTS idx_receiver_status ON friendships(receiver_id, status);
  `)
}
