import { SiConcourse } from "react-icons/si";
import UsersPanel from "./contacts/UsersPanel.jsx";
import ConversationPanel from "./conversation/ConversationPanel.jsx";
import {useState, useEffect, useRef} from "react";

export let currentUser  = {
  id: 1,
  name: "ayoub",
  photo_url: "src/assets/avatar.png"
}

function App() {
  
  let [screenWidth, setScreenWidth] = useState(window.innerWidth);
  let [userCardSelected, setUserCardSelected] = useState({});
  let [chatMessages, setChatMessages] = useState([]);
  let [shownUserCards, setShownUserCards] = useState([]);
  let [cardsRefresh, setCardsRefresh] = useState(false);
  
  let socket = useRef(null);
  let previousCard = useRef({});

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080/messages/1");
    const resizeHandler = () => setScreenWidth(window.innerWidth);
    socket.current.onclose = (event) => {
        console.log("socket connection closed")
    }

    socket.current.onerror = (event) => {
      console.log("socket connection have an error");
    }

    window.addEventListener("resize", resizeHandler);

    return (() => {
      if (socket.current.readyState === WebSocket.OPEN)
        socket.current.close(1000, "Chat component is closed");
      window.removeEventListener("resize", resizeHandler);
      console.log("connection closed!");
      });
  }, []);
  
  useEffect(() => {
    if (userCardSelected.id === 0 && chatMessages.length > 0){
      setChatMessages([]);
      setShownUserCards(shownUserCards.filter((card) => card.friend.id !== userCardSelected.friend?.id))
    }
  }, [userCardSelected.friend]);

  useEffect(() => {
    socket.current.onmessage = (event) => {
      let incomingMsg = JSON.parse(event.data);
      switch (incomingMsg.type){
        case "message": {
          if (incomingMsg.senderId === userCardSelected.friend?.id){
            setChatMessages([...chatMessages, {
              id: incomingMsg.id,
              senderId: incomingMsg.senderId,
              content: incomingMsg.content
            }]);
            return ;
          }
          setCardsRefresh(!cardsRefresh);
          return;
        }
        case "user-presence": {
          console.log(`userId: ${incomingMsg.userId}, presence: ${incomingMsg.presence}`);
          setShownUserCards(shownUserCards.map((card) => {
              if (card.friend.id === incomingMsg.userId)
                return ({...card, presence: incomingMsg.presence});
              return (card);
            }));
          if (incomingMsg.userId === userCardSelected.friend?.id){
            setUserCardSelected({...userCardSelected, presence: incomingMsg.presence});
          }
        }
      }
    }
  }, [userCardSelected, chatMessages, cardsRefresh, shownUserCards]);
 
  function handleUserCardSelection(selectedUserCard)
  {
    if (selectedUserCard.id !== 0 && socket.current.readyState === WebSocket.OPEN){
      socket.current.send(JSON.stringify({
        action: "enter-conversation",
        conversationId: selectedUserCard.id
      }));
      setUserCardSelected(selectedUserCard);
      setShownUserCards([...shownUserCards].map((card) => {
        if (card.id === selectedUserCard.id)
          return ({...card, unread_msg: 0});
        return (card);
      }));
    }
    setUserCardSelected(selectedUserCard);
    previousCard.current = userCardSelected;
  }

  let style = "p-5 h-full w-full items-start " + ((screenWidth > 500) ? "flex" : "");

  return (
    <div id="Chat" className={style}>
      <UsersPanel
        selectedCard={userCardSelected}
        onCardSelect={handleUserCardSelection}
        shownCards={shownUserCards}
        setShownCards={setShownUserCards}
        refreshCards={cardsRefresh}
        socket={socket.current}
      />
      {
        (screenWidth > 500) && <ConversationPanel
            currenctUser={currentUser}
            targetUserCard={userCardSelected}
            screenWidth={screenWidth}
            messages={chatMessages}
            setMessages={setChatMessages}
            socket={socket.current}
          />
      }
    </div>
  );
}

export default App;