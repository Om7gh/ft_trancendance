class UsersBlockManager{
    #dbInstance;

    constructor(dbInstance){
        this.#dbInstance = dbInstance;
    }

    hasBlocked(blockerId, blockedId){
        const blockEntry = this.#dbInstance.prepare(
            `SELECT * FROM users_blocks WHERE blockerID = ? AND targetID = ?`
        )
        .get(blockerId, blockedId);
        return (blockEntry !== undefined);
    }

    addBlock(blockerId, targetId){
        this.#dbInstance.prepare(`INSERT INTO users_blocks (blockerID, targetID) VALUES (?, ?)`)
        .run(blockerId, targetId);
    }

    removeBlock(blockerId, targetId){
        this.#dbInstance.prepare(
            `DELETE FROM users_blocks WHERE blockerID = ? && targetID = ?`
        )
        .run(blockerId, targetId);
    }
}

export default UsersBlockManager;