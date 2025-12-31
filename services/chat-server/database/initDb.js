function initDb(dbInstance){
	console.log("=== initializing Chat database... ===");

	dbInstance.exec(`PRAGMA foreign_keys = ON;`);
	
	dbInstance.exec(`CREATE TABLE IF NOT EXISTS conversations (
		id INTEGER PRIMARY KEY,
		firstUserID TEXT NOT NULL,
		secondUserID TEXT NOT NULL,
		firstUserJson TEXT NOT NULL,
		secondUserJson TEXT NOT NULL,
		firstUserUnreadCount INTEGER NOT NULL DEFAULT 0,
		secondUserUnreadCount INTEGER NOT NULL DEFAULT 0,
		lastMessage TEXT NOT NULL DEFAULT '',
		lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`);

	dbInstance.exec(`
		CREATE TABLE IF NOT EXISTS messages(
		id INTEGER PRIMARY KEY,
		convID INTEGER NOT NULL,
		senderID INTEGER NOT NULL,
		content TEXT NOT NULL,
		FOREIGN KEY (convID) REFERENCES conversations (id)
		);`);

	dbInstance.exec(`
		CREATE TABLE IF NOT EXISTS users_blocks(
		blockerID INTEGER NOT NULL,
		targetID INTEGER NOT NULL,
		at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`);
	
	
	console.log("--- DONE ---")
}

export default initDb;