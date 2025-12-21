class Messages {
    #id;
    #conversationId;
    #senderId;
    #content;
    #seen;
    
    constructor(convId, senderId, content){
        this.#id = Messages.autoInc;
        this.#conversationId = convId;
        this.#senderId = senderId;
        this.#content = content;
        this.#seen = false;
        Messages.autoInc++;
    }

    get message() {
        return ({
            id: this.#id,
            senderId: this.#senderId,
            content: this.#content
        });
    }

    get convId() {
        return (this.#conversationId);
    }

    get isSeen() {
        return this.#seen;
    }

    static autoInc = 1;
};

export default Messages;