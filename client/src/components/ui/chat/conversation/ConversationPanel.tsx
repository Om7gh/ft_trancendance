import ChatBody from "./ChatBody.tsx";
import ChatInput from "./ChatInput.tsx";
import ChatHeader from "./ChatHeader.tsx";
import StatusResolver from "@/utils/JsxByStatus.tsx";
import useAxios from "@/hooks/useAxios.ts";
import {useContext, useState} from "react";
import { GlobalContext } from "@/App.tsx";
import useWsRequest from "@/hooks/useWsRequest.ts";

import type {Card} from "@/types/UserCard.ts"
import type {User} from "@/types/User.ts"
import type {User as GloblaUser} from "@/App.tsx"
import type {ServerRequest} from "@/types/serverRequest.ts"

import ConversationImg from "@assets/placeholders/conversation.png";
import useWsResponse from "@/hooks/useWsResponse.ts";
import inviteRedirection from "@/services/chat/inviteToMatch.ts" 

interface ConversationPanelProps{
	targetUserCard: Card | null;
	UsersTab: string;
	connection: React.RefObject<WebSocket | null>;
	updateSenderCard: React.Dispatch<React.SetStateAction<any>>
	onBlockToggle: (action: "block" | "unblock") => void;
	changeUserView: (view: string) => void;
}

function constructReq(
	sender: User | null,
	target: User,
	content: string
): ServerRequest{
	return ({
		action: "send-message",
		sender: sender,
		target: target,
		content: content
	} as ServerRequest);
}

function ConversationPanel({
	UsersTab,
	targetUserCard,
	connection,
	onBlockToggle,
	updateSenderCard,
	changeUserView
}: ConversationPanelProps){
	const userInfo  = useContext(GlobalContext);
	const [showActions, setShowActions] = useState(false);
	const [messages, setMessages, messageStatus] = useAxios(
		(targetUserCard && targetUserCard.id)
			? `/messages/${targetUserCard.id}` 
			: null);
	const setRequest = useWsRequest(connection.current);
	useWsResponse(connection, incomingMsgHandler, targetUserCard?.friend.id);

	const {id, username: name, avatar: photo_url} = userInfo?.user as GloblaUser;
	const currentUser : User = {id, name, photo_url, connectionState: "active"};

	function incomingMsgHandler(msg: any){
		if (msg.senderID === targetUserCard?.friend?.id){
			setMessages((prev: any) => [...prev, {
				id: msg.id,
				senderID: msg.senderID,
				content: msg.content
			}]);
		}
	}

	function handleSendingMsg(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const inputControl = e.currentTarget.elements.namedItem("messageInput") as HTMLInputElement
		const button = e.currentTarget.elements.namedItem("button") as HTMLInputElement;
		
		if (button.value === "unblock"){
			handleUserAction(button.value);
			return;
		}
		
		const inputText = inputControl.value.trim();
		if (inputText.length !== 0){
			setMessages([
				...messages,
				{
					id: crypto.randomUUID(),
					senderID: currentUser.id,
					content: inputText
				}
			])
			updateSenderCard((prev: Card[]) => {
				return (prev.map(card => {
					if (card.friend.id === targetUserCard?.friend.id)
						return ({...card, lastMsg: inputText});
					return (card);
				}));
			});
			setRequest(constructReq(currentUser, targetUserCard?.friend as User, inputText));
			setTimeout(() => changeUserView("Chats"), 300);
		}
		inputControl.value = "";
	}

	function handleUserAction(action: string){
		switch (action){
			case "block":
			case "unblock": {
				onBlockToggle(action);
				break ;
			}
			case "back": {
				changeUserView("contacts");
				break ;
			}
			case "invite": {
				inviteRedirection(targetUserCard?.friend?.id as string);
			}
		}
	}

	function handleToggelButton(){
		setShowActions(!showActions);
	}

	if (targetUserCard?.friend === undefined)
		return (
			<div id="ConversationPanel" className="h-full flex-2 ml-4 pl-2 flex flex-col items-center justify-center">
				<img src={ConversationImg} className="w-[50%]" alt="decorator image for unselected conversation"/>
				<p className="text-gray-200 font-bold">Conversation missing. Target a conversation</p>
			</div>
		)
	return (
		<div key={targetUserCard?.friend?.id} id="ConversationPanel" className="h-full flex-2 p-2 ml-4 flex flex-col">
			<ChatHeader
				contact={targetUserCard?.friend}
				UsersTab={UsersTab}
				showActions={showActions}
				presence={targetUserCard.presence}
				onTap={handleToggelButton}
				onAction={handleUserAction}
			/>
			<StatusResolver status={messageStatus} content={messages} view="Messages">
				<ChatBody senderUser={currentUser} targetUser={targetUserCard.friend} messages={messages}/>
			</StatusResolver>
			<ChatInput onSend={handleSendingMsg} connectionState={targetUserCard.friend.connectionState}/>
		</div>
	);
}

export default ConversationPanel;