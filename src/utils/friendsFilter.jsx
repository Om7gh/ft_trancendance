import users from "../friends.jsx";

function friendsFilterByQuery(query, friends){
  return (friends.filter(friend => {
    let tmpName = friend.name;
    return (tmpName.toLowerCase().includes(query.toLowerCase()))
  }))
}

function friendsFilterByTab(tabName){
  
  let friends = users.user.friends;
  switch (tabName)
  {
    case "Chats": {
      // display all the users that have conversation with the current user
      // recieved from the backend
      //!comunication with the server should be on /conversation using GET
      return (friends);
    }
    case "Unread": {
      // display the users with unreaded message recieved from the backend
      //!comunication with the server should be on /conversation?status=unread usint GET
      return (friends.filter(user => user.unread_msg > 0));
    }
    case "Contacts": {
      // list all friends of this user sorted by there names.
      //! comunication with the server should be on /contacts using GET

      return (friends.map((friend) => ({
        id: friend.id,
        name: friend.name,
        photo_url: friend.photo_url
        })));
    }
  }
}

export {friendsFilterByQuery, friendsFilterByTab};