/* eslint-disable @typescript-eslint/no-unused-vars */
import useAxios from "../hooks/useAxios.ts";
import usePresence from "../hooks/usePresence.ts";
import useWebsocket from "../hooks/useWebsocket.ts";
import useEventListener from "../hooks/useEventListener.ts";
import UsersPanel from "../components/ui/chat/contacts/UsersPanel.tsx";
import ConversationPanel from "../components/ui/chat/conversation/ConversationPanel.tsx";
import {useState, useRef, createContext} from "react";
import useWsRequest from "@/hooks/useWsRequest.ts"
import useWsResponse from "@/hooks/useWsResponse.ts"
import visibleCardsResolver from "@/utils/cardsResolver.ts"

import type {ServerRequest} from "@/types/serverRequest.ts";

interface context{
	isMobile: boolean;
	viewportWidth: number;
}

import type {Card} from "@/types/UserCard.ts";

export const ViewportContext = createContext<context | null>(null);

function Chat(){
	
	const [selectedTab, setSelectedTab] = useState("Chats");
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [serachQuery, setSearchQuery] = useState("");
	const [mobileView, setMobileView] = useState("contacts");

	const [chatCards, setChatCards, conversationStatus] = useAxios(`/conversations`);
	const [contactCards, setContactCards, contactStatus] = useAxios(`/contacts`);
	const socket = useWebsocket(`/messages`);
	const setRequest = useWsRequest(socket.current);

	const selectedCardRef = useRef<Card | null>(selectedCard);
	const isMobile = screenWidth <= 930;
	const showContact = (!isMobile || mobileView ===  "contacts"); 
	const showConversation = (!isMobile || mobileView === "conversation");

	usePresence(chatCards, contactCards, socket);
	useEventListener(window, "resize", () => setScreenWidth(window.innerWidth));
	useWsResponse(socket, incomingMsgResolver);

	
	const visibleCards = visibleCardsResolver(
		chatCards,
		contactCards,
		selectedTab,
		serachQuery
	);
	
	function getFetchStatusByTab(tabName: string){
		if (tabName === "Chats" || tabName === "Unread")
			return (conversationStatus);
		return contactStatus;
	}

	function handleUserCardSelection(userCardSelected: Card)
	{
		if (userCardSelected.id !== 0){
			setChatCards(chatCards.map((card: Card) => {
				if (card.id === userCardSelected.id)
					return ({...card, unread_msg: 0});
				return (card);
			}));
			setRequest({
				action: "enter-conversation",
				conversationId: userCardSelected.id
			} as ServerRequest);
		}
		setMobileView("conversation");
		setSelectedCard(userCardSelected);
		selectedCardRef.current = userCardSelected;
	}

	function changeUserView(view: string){
		if (view === "Chats"){
			setSelectedTab(view);
			setContactCards(contactCards.filter((card: Card) => {
				return (card.friend.id !== selectedCard?.friend?.id);
			}));
			return;
		}
		setMobileView(view);
		setSelectedCard(null);
		selectedCardRef.current = null;
		if (selectedCard && selectedCard.id > 0){
			setRequest({
				action: "leave-conversation",
				conversationId: selectedCard.id
			});
		}
	}

	function handleBlockToggle(action: "block" | "unblock"){
		const blockState = (action === "block") ? "blocking_them" : "active";
		const selectedCardUpdate = {
			...selectedCard,
			friend:{
				...selectedCard?.friend,
				connectionState: blockState
			}
		}

		setChatCards(chatCards.map((card: Card) => {
			if (card.friend.id === selectedCard?.friend.id){
				return ({
					...card,
					friend:{
						...card.friend,
						connectionState: blockState
					}});
			}
			return (card);
			}));
			setSelectedCard(selectedCardUpdate as Card);
			selectedCardRef.current = selectedCardUpdate as Card;
			setRequest({
				action: action + "-user",
				targetId: selectedCard?.friend.id
			} as ServerRequest);
	}

	function incomingMsgResolver(msg: any) : void {
		switch (msg.type){
			case "message": {
				if (msg.senderID !== selectedCardRef.current?.friend?.id){
					setChatCards((prev: Card[]) => prev.map((card: Card) => {
						if (card.friend.id === msg.senderID){
							return ({
								...card,
								unread_msg: card.unread_msg + 1,
								lastMsg: msg.content
							});
						}
						return (card);
					}));
				}
				break ;
			}
			case "user-presence": {
				setChatCards((prev: Card[]) => (prev.map((card: Card) => {
					if (card.friend.id === msg.userId)
						return ({...card, presence: msg.presence});
					return (card);
				})));

				setContactCards((prev: Card[]) => prev.map((card: Card) => {
					if (card.friend.id === msg.userId)
						return ({...card, presence: msg.presence});
					return (card);
				}));
				if (msg.userId === selectedCardRef.current?.friend?.id){
					const selectedCardUpdate = {
						...selectedCardRef.current,
						presence: msg.presence
					};
					selectedCardRef.current = selectedCardUpdate as Card;
					setSelectedCard(selectedCardUpdate as Card);
				}
				break ;
			}
			case "new-conversation":{
				setChatCards((prev: Card[]) => [...prev, msg.conversation]);
				setContactCards((prev: Card[]) => prev.filter((contact: Card) => {
					return (contact.friend.id !== msg.conversation.friend.id);
				}));
				break ;
			}
			case "connection-update":{
				setChatCards((prev: Card[]) => prev.map((card: Card) => {
					if (card.friend.id ===  msg.stateBy){
						return ({
							...card,
							friend:{
								...card.friend,
								connectionState: msg.connectionState
							}}
						);
					}
					return (card);
				}));
				setContactCards((prev: Card[]) => prev.map((card: Card) => {
					if (card.friend.id ===  msg.stateBy){
						return ({
							...card,
							friend:{
								...card.friend,
								connectionState: msg.connectionState
							}});
					}
					return (card);
				}));
				if (msg.stateBy === selectedCardRef.current?.friend?.id){
					const selectedCardUpdate = {
						...selectedCardRef.current,
						friend: {
							...selectedCardRef.current?.friend,
							connectionState: msg.connectionState
						}
					};
					selectedCardRef.current = selectedCardUpdate as Card;
					setSelectedCard(selectedCardUpdate as Card);
				}
			}
		}
	}

	const style = "p-5 h-full w-full text-[clamp(12px,0.8vw,25px)] relative " + (!isMobile ? "flex" : "");

	return (
		<div id="Chat" className={style}>
			<ViewportContext value={{isMobile: isMobile, viewportWidth: screenWidth}}>
			{
				showContact && <UsersPanel
				selectedCard={selectedCard}
				onCardSelect={handleUserCardSelection}
				visibleCards={visibleCards}
				setSearchQuery={setSearchQuery}
				updateTabName={setSelectedTab}
				selectedTab={selectedTab}
				getCardStatus={getFetchStatusByTab}
				/>
			}
			{
				<>
					{!isMobile && <div className="w-0.5 h-full self-center ml-10 rounded-b-4xl bg-violet-500"></div>}
					{
						showConversation && <ConversationPanel
						key={selectedCard?.friend?.id}
						UsersTab={selectedTab}
						targetUserCard={selectedCard}
						connection={socket}
						updateSenderCard={setChatCards}
						onBlockToggle={handleBlockToggle}
						changeUserView={changeUserView}
						/>
					}
				</>
			}
			</ViewportContext>
		</div>
	);
}

export default Chat