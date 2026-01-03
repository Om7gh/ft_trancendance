import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import PongError from '../classes/PongError.js';
import DatabaseService from '../classes/databaseClass.js';

export function initDatabase(dbPath = './pong.db') {
    const db = new Database(dbPath);
    
    db.pragma('journal_mode = WAL');
    
    db.pragma('foreign_keys = ON');
    
    db.exec(`

        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS matches (
            id TEXT PRIMARY KEY,
            left_player_id TEXT NOT NULL,
            left_player_points INTEGER NOT NULL,
            right_player_id TEXT NOT NULL,
            right_player_points INTEGER NOT NULL,
            winner_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (left_player_id) REFERENCES users(id),
            FOREIGN KEY (right_player_id) REFERENCES users(id),
            FOREIGN KEY (winner_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS pong_customizations (
            id TEXT PRIMARY KEY,
            ball_color TEXT DEFAULT '#FF8C00',
            left_paddle_color TEXT DEFAULT '#00FF00',
            right_paddle_color TEXT DEFULAT '#FF0000',
            table_edges_color TEXT DEFAULT '#FFFFFF',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS chess_customizations (
            id TEXT PRIMARY KEY,
            chess_piece TEXT DEFAULT 'alpha',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
            
    return db;
}
        
        
export default fp(async function dataBase(fastify, options) {
    try {
        const db = initDatabase(options.dbPath);
        const dbService = new DatabaseService(db);
        
        fastify.decorate('db', dbService);
        
        fastify.addHook('onClose', async (instance, done) => {
            db.close();
            done();
        });
    } catch (err) {
        throw new PongError(503, "Erro during pong's data base initialization!!");
    }
});

            