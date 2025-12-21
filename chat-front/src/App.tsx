import UsersPanel from "./contacts/UsersPanel.jsx";
import ConversationPanel from "./conversation/ConversationPanel.tsx";
import useEventListener from "../hooks/useEventListener.ts";
import {useState, useEffect, useRef} from "react";
import useWebsocket from "../hooks/useWebsocket.ts";
import useFetch from "../hooks/useFetch.ts";
import { cardsFilterByQuery } from '../src/utils/filter';
import usePresence from "../hooks/usePresence.ts";

import Card from "./types/UserCard.ts"

export let currentUser  = {
  id: 1,
  name: "ayoub",
  photo_url: "src/assets/avatar.png"
}

function visibleCardsResolver(conversationCards: Card[], contactCards: Card[], tabName: string, qurey: string){
	
	function cardsFilterByTab(): Card[]{
		switch (tabName){
			case "Contacts":
				return (contactCards);
			case "Unread":
				return conversationCards.filter(user => user.unread_msg > 0);
			default:
				return conversationCards
		}
	}

  let cards = cardsFilterByTab();
  (qurey.length !== 0) && (cards = cardsFilterByQuery(qurey, cards));
  return (cards);
}

function App(){

  let selectedTab = useRef("Chats");
  
  let [screenWidth, setScreenWidth] = useState(window.innerWidth);
  let [selectedCard, setSelectedCard] = useState<Card | null>(null);
  let [updateVisibleCards, setUpdateVisibleCards] = useState(0);
  let [serachQuery, setSearchQuery] = useState("");
  let [mobileView, setMobileView] = useState("contacts");
  
  let [chatCards, conversationStatus] = useFetch(`/conversations/${currentUser.id}`);
  let [contactCards, contactStatus] = useFetch(`/contacts/${currentUser.id}`);
  let socket = useWebsocket(`/messages/${currentUser.id}`);


  let isMobile = screenWidth <= 500;

  let showContact = (!isMobile || mobileView ===  "contacts"); 
  let showConversation = (!isMobile || mobileView === "conversation");

  usePresence(chatCards.current, contactCards.current, socket);
  useEventListener(window, "resize", () => setScreenWidth(window.innerWidth));

  let visibleCards = visibleCardsResolver(chatCards.current, contactCards.current, selectedTab.current, serachQuery);

  function getFetchStatusByTab(tabName: string){
    if (tabName === "Chats" || tabName === "Unread")
      return (conversationStatus);
    return contactStatus;
  }

  function handleUserCardSelection(selectedCard: Card)
  {
    if (selectedCard.id !== 0){
      chatCards.current = chatCards.current.map((card: Card) => {
        if (card.id === selectedCard.id)
          return ({...card, unread_msg: 0});
        return (card);
      });
    }
    setMobileView("conversation");
    setSelectedCard(selectedCard);
  }

  function changeUserView(view: string){
    if (view === "Chats"){
      selectedTab.current = view;
      contactCards.current = contactCards.current.filter((card: Card) => {
        return (card.friend.id !== selectedCard?.friend.id);
      })
      setUpdateVisibleCards(updateVisibleCards + 1);
      return;
    }
    setMobileView(view);
    setSelectedCard(null);
  }

  useEffect(() => {
    if (selectedCard?.id && socket.current?.readyState === WebSocket.OPEN){
      socket.current.send(JSON.stringify({
        action: "enter-conversation",
        conversationId: selectedCard.id
      }));
    }
  }, [socket, selectedCard]);

  useEffect(() => {

    function incomingMsgHandler(event: MessageEvent) {
      let incomingMsg = JSON.parse(event.data);
      switch (incomingMsg.type){
        
        case "message": {
          if (incomingMsg.senderId !== selectedCard?.friend?.id){
            chatCards.current = chatCards.current.map((card: Card) => {
              if (card.friend.id === incomingMsg.senderId)
                return ({...card, unread_msg: card.unread_msg + 1});
              return (card);
            });
            setUpdateVisibleCards(prev => ++prev);
          }
          break ;
        }
        case "user-presence": {
          chatCards.current = chatCards.current.map((card: Card) => {
            if (card.friend.id === incomingMsg.userId)
              return ({...card, presence: incomingMsg.presence});
            return (card);
          });
          contactCards.current = contactCards.current.map((card: Card) => {
            if (card.friend.id === incomingMsg.userId)
              return ({...card, presence: incomingMsg.presence});
            return (card);
          });
          if (incomingMsg.userId === selectedCard?.friend?.id){
            setSelectedCard({...selectedCard, presence: incomingMsg.presence} as Card);
          }
          setUpdateVisibleCards(prev => ++prev);
          break ;
        }
        case "new-conversation":{
          chatCards.current.push(incomingMsg.conversation);
          contactCards.current = contactCards.current.filter((contact: Card) => contact.friend.id !== incomingMsg.conversation.friend.id);
        }
      }
    }

    socket.current?.addEventListener("message", incomingMsgHandler);
    
    return (() => {
      socket.current?.removeEventListener("message", incomingMsgHandler);
    });
  }, [selectedCard, socket, contactCards, chatCards]);


  let style = "p-5 h-full w-full items-start " + (!isMobile ? "flex" : "");

  return (
    <div id="Chat" className={style}>
      {
        showContact && <UsersPanel
          selectedCard={selectedCard}
          onCardSelect={handleUserCardSelection}
          visibleCards={visibleCards}
          updateVisibleCards={setUpdateVisibleCards}
          setSearchQuery={setSearchQuery}
          selectedTab={selectedTab}
          getCardStatus={getFetchStatusByTab}
        />
      }
      {
        showConversation && <ConversationPanel
          key={selectedCard?.friend?.id}
          UsersTab={selectedTab.current}
          currenctUser={currentUser}
          targetUserCard={selectedCard}
          isMobile={isMobile}
          connection={socket}
          changeUserView={changeUserView}
        />
      }
    </div>
  );
}

export default App;