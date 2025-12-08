import UsersPanel from "./contacts/UsersPanel.jsx";
import ConversationPanel from "./conversation/ConversationPanel.jsx";
import {useState, useEffect} from "react";
import users from "./friends.jsx";

function App() {

  let [screenWidth, setScreenWidth] = useState(window.innerWidth);
  let [friendSelected, setFriendSelected] = useState(null);
  let [shownFriends, setShownFriends] = useState(null);
  let [chatMessages, setChatMessages] = useState(null);
  
  /* useEffect((){
      1: create the websocket client that connect to the server socket
      2: setup the websocket handlers
      3: return the cleanup function that must close the connection with the server
    })
  */

  //! this needs useEffect.
  window.onresize = () => {
    setScreenWidth(window.innerWidth);
  }
  
  function handleUserSelection(selectedFriend)
  {
    // the server should know about the conversation to initialize it and save in DB.
    //! this happend on /conversation endpoint using POST method
    //! posting the current user with the selected user as drawn in tldraw
    setFriendSelected(selectedFriend);
  }
  let style = "p-5 h-full w-full items-start " + ((screenWidth > 500) ? "flex" : "");

  return (
    <div id="Chat" className={style}>
      <UsersPanel
        friendSelected={friendSelected}
        onSelect={handleUserSelection}
        users={shownFriends}
        setUsers={setShownFriends}
      />
      {
        (screenWidth > 500) && <ConversationPanel
            currenctUser={users.user}
            targetUser={friendSelected}
            screenWidth={screenWidth}
            messages={chatMessages}
            setMessages={setChatMessages}
          />
      }
    </div>
  );
}

export default App;