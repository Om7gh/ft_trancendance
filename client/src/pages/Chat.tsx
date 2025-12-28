/* eslint-disable @typescript-eslint/no-unused-vars */
import useAxios from "../hooks/useAxios.ts";
import usePresence from "../hooks/usePresence.ts";
import useWebsocket from "../hooks/useWebsocket.ts";
import useEventListener from "../hooks/useEventListener.ts";
import UsersPanel from "../components/ui/chat/contacts/UsersPanel.tsx";
import ConversationPanel from "../components/ui/chat/conversation/ConversationPanel.tsx";
import {useState, useRef} from "react";
import useWebsocketRequest from "../hooks/useWebsocketRequest.ts"
import visibleCardsResolver from "@/utils/cardsResolver.ts"

import type {ServerRequest} from "@/types/serverRequest.ts";
import type {Card} from "../types/UserCard.ts";

function Chat(){

	const selectedTab = useRef("Chats");
	
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [updateVisibleCards, setUpdateVisibleCards] = useState(0);
	const [serachQuery, setSearchQuery] = useState("");
	const [mobileView, setMobileView] = useState("contacts");
	
	const [chatCards, conversationStatus] = useAxios(`/conversations`);
	const [contactCards, contactStatus] = useAxios(`/contacts`);
	const socket = useWebsocket(`/messages`);
	const setRequest = useWebsocketRequest(socket.current);

	
	const isMobile = screenWidth <= 500;
	const showContact = (!isMobile || mobileView ===  "contacts"); 
	const showConversation = (!isMobile || mobileView === "conversation");

	usePresence(chatCards.current, contactCards.current, socket);
	useEventListener(window, "resize", () => setScreenWidth(window.innerWidth));
	useEventListener(window, "message", incomingMsgHandler);

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
			setRequest({
				action: "enter-conversation",
				conversationId: selectedCard.id
			} as ServerRequest);
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
		if (selectedCard && selectedCard.id > 0){
			setRequest({
				action: "leave-conversation",
				conversationId: selectedCard!.id
			});
		}
	}

	function handleBlockToggle(action: "block" | "unblock"){
		const blockState = (action === "block") ? "blocking_them" : "active";
		chatCards.current = chatCards.current.map((card: Card) => {
			if (card.friend.id === selectedCard?.friend.id)
				return ({
					...card,
					friend:{
						...card.friend,
						connectionState: blockState
					}});
				return (card);
			});
			setSelectedCard({
				...selectedCard,
				friend: {
					...selectedCard?.friend,
					connectionState: blockState
			}} as Card);
			setRequest({
				action: action + "-user",
				targetID: selectedCard?.friend.id
			} as ServerRequest);
	}

	function incomingMsgHandler(event: MessageEvent) {
		const incomingMsg = JSON.parse(event.data);
		switch (incomingMsg.type){
			case "message": {
				if (incomingMsg.senderId !== selectedCard?.friend?.id){
					chatCards.current.forEach((card: Card) => {
						if (card.friend.id === incomingMsg.senderId)
							card = {...card, unread_msg: card.unread_msg + 1};
					});
					setUpdateVisibleCards(prev => ++prev);
				}
				break ;
			}
			case "user-presence": {
				chatCards.current.forEach((card: Card) => {
					if (card.friend.id === incomingMsg.userId)
						card = {...card, presence: incomingMsg.presence};
				});
				contactCards.current.forEach((card: Card) => {
					if (card.friend.id === incomingMsg.userId)
						card = {...card, presence: incomingMsg.presence};
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
				break ;
			}
			case "connection-update":{
				chatCards.current.forEach((card: Card) => {
					if (card.friend.id ===  incomingMsg.stateBy){
						card = {
							...card,
							friend:{
								...card.friend,
								connectionState: incomingMsg.connectionState
							}};
					}
				});
				contactCards.current.forEach((card: Card) => {
					if (card.friend.id ===  incomingMsg.stateBy){
						card = {
							...card,
							friend:{
								...card.friend,
								connectionState: incomingMsg.connectionState
							}};
					}
				});
				if (incomingMsg.stateBy === selectedCard?.friend?.id){
					setSelectedCard({
						...selectedCard,
						friend: {
							...selectedCard?.friend,
							connectionState: incomingMsg.connectionState
						}
					} as Card);
				}
				setUpdateVisibleCards(updateVisibleCards + 1);
			}
		}
	}


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
					onBlockToggle={handleBlockToggle}
					changeUserView={changeUserView}
				/>
			}
		</div>
	);
}

export default Chat