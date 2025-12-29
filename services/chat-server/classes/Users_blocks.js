class UsersBlocksManager {
    #id;
    #blockerID;
    #blockedID;
    constructor(blockerID, blockedID){
        this.#id = UsersBlocksManager.autoInc;
        this.#blockerID = blockerID;
        this.#blockedID = blockedID;
        UsersBlocksManager.autoInc++;
    }

    get id() {
        return (this.#id);
    }

    get blockerID() {
        return (this.#blockerID);
    }

    get blockedID() {
        return (this.#blockedID);
    }
    static autoInc = 1;
};

export default UsersBlocksManager;