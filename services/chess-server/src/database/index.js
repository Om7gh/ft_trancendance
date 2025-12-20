const fp = require('fastify-plugin');
const Database = require('better-sqlite3');

async function chessDb(fastify) {
  const db = new Database('./chess.sqlite');
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  db.exec(`
        CREATE TABLE IF NOT EXISTS players (
            id TEXT PRIMARY KEY,
            username TEXT,
            avatar TEXT,
            pieces  TEXT DEFAULT 'alpha',
            created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
            rate INTEGER DEFAULT 1000
        );

        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id TEXT,
            white_player_id TEXT NOT NULL,
            black_player_id TEXT NOT NULL,
            winner_team TEXT CHECK (winner_team IN ('WHITE','BLACK','DRAW')),
            reason TEXT,
            moves INTEGER NOT NULL DEFAULT 0,
            started_at INTEGER,
            ended_at INTEGER,
            duration_ms INTEGER,
            FOREIGN KEY (white_player_id) REFERENCES players(id),
            FOREIGN KEY (black_player_id) REFERENCES players(id)
        );
    `);

  fastify.decorate('db', db);

  fastify.addHook('onClose', (instance, done) => {
    try {
      db.close();
    } catch {}
    done();
  });
}

module.exports = fp(chessDb, { name: 'db' });
