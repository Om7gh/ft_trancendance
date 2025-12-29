
function getBlockState(user1Id, user2Id, blockManager){
    if (blockManager.hasBlockedBy(user1Id, user2Id))
        return ("blocking_them");
    if (blockManager.hasBlockedBy(user2Id, user1Id))
        return ("blocked_by_them");
    return ("active");
}

export default getBlockState;