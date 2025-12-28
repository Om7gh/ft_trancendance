
function getBlockState(user1Id, user2Id, blockManager){
    console.log ("============== blockManager is : ", blockManager);
    if (blockManager.hasBlocked(user1Id, user2Id))
        return ("blocking_them");
    if (blockManager.hasBlocked(user2Id, user1Id))
        return ("blocked_by_them");
    return ("active");
}

export default getBlockState;