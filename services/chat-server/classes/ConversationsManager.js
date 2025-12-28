class ConversationManager{
	#dbInstance;
	
	constructor(dbInstance){
		this.#dbInstance = dbInstance;
	};

	hasConversation(user1ID, user2ID) {
		const conversation = this.#dbInstance.prepare(
			`SELECT * FROM conversations
			WHERE (firstUserID = @firstID AND secondUserID = @secondID)
			OR
			(firstUserID = @secondID AND secondUserID = @firstID);`
		)
		.get({
			firstID: user1ID,
			secondID: user2ID
		});

		return (conversation);
	}

	getUserConversations(userID){
		const conversations = this.#dbInstance.prepare(
			`SELECT * FROM conversations WHERE firstUserID = @user
			OR secondUserID = @user;`
		)
		.all({user: userID});
		return (conversations);
	}

	addConversation(firstUser, secodeUser){
		const recentConversation = this.#dbInstance.prepare(
			`INSERT INTO conversations VALUES(@user1ID, @user2ID, @user1Info, @user2Info)
			RETURNING *;`
		)
		.get({
			user1ID: firstUser.id,
			user2ID: secodeUser.id,
			user1Info: firstUser,
			user2Info: secodeUser
		});

		return (recentConversation);
	}

	findConversation(convId){
		const result = this.#dbInstance.prepare(
			`SELECT * FROM conversations WHERE convID = ? `
		)
		.get(convId);
		return (result);
	}

	resetUserUnreadCount(userID){
		this.#dbInstance.prepare(
			`UPDATE conversations SET
			firstUserUnreadCount = CASE WHEN
				firstUserID = @inputId THEN 0
			ELSE
				firstUserUnreadCount END,
			secondUserUnreadCount = CASE WHEN
				secondUserID = @inputId THEN 0
			ELSE
				secondUserUnreadCount END
			WHERE firstUserID = @inputId OR secondUserID = @inputId`
		)
		.run({
			inputId: userID,
		});
	}

	incrementUserUnreadCount(userID){
		this.#dbInstance.prepare(
			`UPDATE conversations SET
			firstUserUnreadCount = CASE WHEN
				firstUserID = @inputId THEN firstUserUnreadCount + 1
			ELSE 
				firstUserUnreadCount END,
			secondUserUnreadCount = CASE WHEN
				secondUserID = @inputId THEN secondUserUnreadCount + 1
			ELSE
				secondUserUnreadCount END
			WHERE firstUserID = @inputId OR secondUserID = @inputId`
		)
		.run({
			inputId: userID,
		});
	}
}

export default ConversationManager;