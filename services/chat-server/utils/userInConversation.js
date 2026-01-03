function userInConversation(userID, conversationID, convManager){
    const conv = convManager.findConversation(conversationID);
    if (conv === undefined || (conv.firstUserID !== userID && conv.secondUserID !== userID))
        return (false);
    return (true);
}

export default userInConversation;