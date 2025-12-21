const fp = require('fastify-plugin');
const Database = require('better-sqlite3');

async function chessDb(fastify) {
  const db = new Database('./chess.sqlite');
  
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
      
      console.log('Game recorded ----> ', {
        roomId: gameData.roomId,
        white: gameData.whiteId,
        black: gameData.blackId,
        winner: gameData.winnerTeam
      });
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
}

module.exports = fp(chessDb, { name: 'db' });
