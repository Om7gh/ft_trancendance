import {currentUser} from "../App.jsx"

function cardsFilterByQuery(query, cards){
  return (cards.filter(card => {
    let tmpName = card.friend.name;
    return (tmpName.toLowerCase().includes(query.toLowerCase()))
  }))
}

async function cardsFilterByTab(shownFriends, tabName){

  switch (tabName)
  {
    case "Chats": {
      let respond = await fetch(`http://localhost:8080/conversations/${currentUser.id}`);
      let result = await respond.json();
      return (result);
    }
    case "Unread": {
      return (shownFriends.filter(user => user.unread_msg > 0));
    }
    case "Contacts": {
      // list all friends of this user sorted by there names.
      let respond = await fetch("http://localhost:8080/contacts/1");
      let result = await respond.json();
      return (result);
    }
  }
}

export {cardsFilterByQuery, cardsFilterByTab};