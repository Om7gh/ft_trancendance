import useAxios from "../hooks/useAxios.ts";
import usePresence from "../hooks/usePresence.ts";
import useWebsocket from "../hooks/useWebsocket.ts";
import useEventListener from "../hooks/useEventListener.ts";
import UsersPanel from "../components/ui/chat/contacts/UsersPanel.tsx";
import ConversationPanel from "../components/ui/chat/conversation/ConversationPanel.tsx";
import {useState, useEffect, useRef} from "react";
import { cardsFilterByQuery } from "../utils/filter.ts";

import type {Card} from "../types/UserCard.ts";

function visibleCardsResolver(
  conversationCards: Card[],
  contactCards: Card[],
  tabName: string,
  query: string
){
	
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
  if (query.length !== 0)
    (cards = cardsFilterByQuery(query, cards));
  return (cards);
}

function App(){

  const selectedTab = useRef("Chats");
  
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [updateVisibleCards, setUpdateVisibleCards] = useState(0);
  const [serachQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState("contacts");
  
  const [chatCards, conversationStatus] = useAxios(`/conversations`);
  const [contactCards, contactStatus] = useAxios(`/contacts`);
  const socket = useWebsocket(`/messages`);


  const isMobile = screenWidth <= 500;

  const showContact = (!isMobile || mobileView ===  "contacts"); 
  const showConversation = (!isMobile || mobileView === "conversation");

  usePresence(chatCards.current, contactCards.current, socket);
  useEventListener(window, "resize", () => setScreenWidth(window.innerWidth));

  const visibleCards = visibleCardsResolver(
    chatCards.current,
    contactCards.current,
    selectedTab.current,
    serachQuery
  );

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
      const incomingMsg = JSON.parse(event.data);
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
          contactCards.current = contactCards.current.filter((contact: Card) => {
            return (contact.friend.id !== incomingMsg.conversation.friend.id);
          })
        }
      }
    }

    socket.current?.addEventListener("message", incomingMsgHandler);
    
    return (() => {
      socket.current?.removeEventListener("message", incomingMsgHandler);
    });
  }, [selectedCard, socket, contactCards, chatCards]);


  const style = "p-5 h-full w-full items-start " + (!isMobile ? "flex" : "");

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