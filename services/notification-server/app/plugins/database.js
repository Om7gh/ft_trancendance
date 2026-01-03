import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import DatabaseService from "../classes/databaseclass.js"
import NotificationError from '../classes/notificationError.js';

export function initDatabase(dbPath = './notification.db') {
    const db = new Database(dbPath);

    db.pragma('foreign_keys = ON');
    
    db.pragma('journal_mode = WAL');

    db.exec( `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            sender_id TEXT NOT NULL,
            receiver_id TEXT NOT NULL,
            expire_time INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id)
        );
    ` );

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
    } catch(err) {
        throw new NotificationError(503, "Fail ton initiate notification data base!!");
    }
});
