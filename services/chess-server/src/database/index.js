const fp = require('fastify-plugin');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { catchAsyncError } = require('../utils/catchAsyncError');

const chessDb = catchAsyncError (async function (fastify) {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, 'chess.sqlite');
  const db = new Database(dbPath);
  
  console.log('Database file location:', dbPath);
  
  db.pragma('foreign_keys = OFF');
  
  db.exec(`
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id TEXT,
            white_player_id TEXT NOT NULL,
            black_player_id TEXT NOT NULL,
            winner_team TEXT CHECK (winner_team IN ('WHITE','BLACK','DRAW')),
            reason TEXT,
            moves INTEGER DEFAULT 0,
            started_at INTEGER,
            ended_at INTEGER
        );

    `);

  fastify.decorate('db', db);

  fastify.decorate('recordGame', (gameData) => {
    try {      
      const stmt = db.prepare(`
        INSERT INTO games (
          room_id, white_player_id, black_player_id, 
          winner_team, reason, moves, started_at, ended_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        gameData.roomId,
        gameData.whiteId,
        gameData.blackId,
        gameData.winnerTeam,
        gameData.reason,
        gameData.moves || 0,
        gameData.startedAt,
        gameData.endedAt
      );
    } catch (error) {
      console.error('❌ Failed to record game:', error);
      throw error;
    }
  });

  fastify.addHook('onClose', (instance, done) => {
    try {
      db.close();
    } catch {}
    done();
  });
})

module.exports = fp(chessDb, { name: 'db' });
