import isBlockedBy from "./isBlockedBy.js"

function friendConnectionState(blockDb, user1, user2){
    if (isBlockedBy(blockDb, user1, user2))
        return ("blocking_them");
    if (isBlockedBy(blockDb, user2, user1))
        return ("blocked_by_them");
    return ("active");
}

export default friendConnectionState;