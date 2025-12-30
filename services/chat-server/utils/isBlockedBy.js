
function isBlockedBy(blockDb, blockerID, blockedID){
    // this will check the database if it find a row with this input return true otherwise false.
   
    if (blockDb.find((entry) => entry.blockerID === blockerID && entry.blockedID === blockedID))
        return (true);
    return (false);
}

export default isBlockedBy;