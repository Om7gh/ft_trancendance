class Conversations {
    #id;
    #user1;
    #user2;
    #lastUpdate;
    #user1UnreadCount;
    #user2UnreadCount;
    
    constructor(user1, user2){
        this.#id = Conversations.autoInc;
        this.#user1 = user1;
        this.#user2 = user2;
        this.#lastUpdate = new Date(Date.now());
        this.#user1UnreadCount = this.#user2UnreadCount = 0;
        Conversations.autoInc++;
    }

    get id() {
        return (this.#id);
    }

    get user1() {
        return (this.#user1);
    }

    get user2() {
        return (this.#user2);
    }

    get lastUpdate(){
        return (this.#lastUpdate);
    }

    get user1UnreadCount(){
        return (this.#user1UnreadCount);
    }
    
    get user2UnreadCount(){
        return (this.#user2UnreadCount);
    }

    set user1UnreadCount(n){
        this.#user1UnreadCount = n;
    }

    set user2UnreadCount(n){
        this.#user2UnreadCount = n;
    }

    static autoInc = 1;
};

export default Conversations;