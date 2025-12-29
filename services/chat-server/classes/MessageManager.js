class MessageManager{
    #dbInstance;
    
    constructor(dbInstance){
        this.#dbInstance = dbInstance;
    }

    addMessage(convId, senderId, content){
        const recentMessage = this.#dbInstance.prepare(
            `INSERT INTO messages (convID, senderID, content)
            VALUES (@convID, @senderID, @msg)
            RETURNING *;`
        )
        .get({
            convID: convId,
            senderID: senderId,
            msg: content 
        });

        return (recentMessage);
    }

    getUserHistoryMsgs(convId){
        const historyMessages = this.#dbInstance.prepare(
            `SELECT * FROM messages WHERE convID = ?;`)
            .all(convId);

        return (historyMessages);
    }
}

export default MessageManager;