function initDb(dbInstance){
	console.log("=== initializing Chat database... ===");

	dbInstance.exec(`PRAGMA foreign_keys = ON;`);
	
	dbInstance.exec(`CREATE TABLE IF NOT EXISTS conversations (
		convID INTEGER PRIMARY KEY,
		firstUserID TEXT NOT NULL UNIQUE,
		secondUserID TEXT NOT NULL UNIQUE,
		firstUserJson TEXT NOT NULL UNIQUE,
		secondUserJson TEXT NOT NULL UNIQUE,
		firstUserUnreadCount INTEGER NOT NULL DEFAULT 0,
		secondUserUnreadCount INTEGER NOT NULL DEFAULT 0,
		lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`);

	dbInstance.exec(`
		CREATE TABLE IF NOT EXISTS messages(
		messageID INTEGER PRIMARY KEY,
		convID INTEGER NOT NULL,
		senderID INTEGER NOT NULL,
		content TEXT NOT NULL,
		FOREIGN KEY (convID) REFERENCES conversations (convID)
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