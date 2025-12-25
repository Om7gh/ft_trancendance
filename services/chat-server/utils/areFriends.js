import contact from "./friends.js";

function areFriends(user1ID, user2ID){
    // will check if the two users given are friends. wierd :(
    if (contact.find((user) => user.id === user2ID)){
        console.log(`${user1ID} and ${user2ID} are friends`);
        return (true); 
    }
    return (false);
}

export default areFriends;