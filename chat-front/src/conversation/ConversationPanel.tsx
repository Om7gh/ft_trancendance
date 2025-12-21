import ChatHeader from "./ChatHeader.tsx";
import ChatBody from "./ChatBody.tsx";
import ChatInput from "./ChatInput.tsx";
import {useEffect, useState} from "react";
import StatusResolver from "../contacts/JsxByStatus.tsx"
import { currentUser as userData } from "../App.tsx";
import useFetch from "../../hooks/useFetch.ts";
import useEventListener from "../../hooks/useEventListener.ts";

import Card from "../types/UserCard.ts"
import User from "../types/User.ts"
import Message from "../types/Message.ts"

interface ConversationPanelProps{
	currenctUser: User;
	targetUserCard: Card | null;
	UsersTab: string;
	isMobile: boolean;
	connection: React.RefObject<WebSocket | null>;
	changeUserView: (view: string) => void;
}

function constructReq(sender: User, target: User, content: string){
	return ({
		action: "send-message",
		sender: sender,
		target: target,
		content: content
	});
}

function ConversationPanel({ currenctUser, UsersTab, targetUserCard, isMobile, connection, changeUserView}: ConversationPanelProps){

	let [showActions, setShowActions] = useState(false);
	let [messages, setMessages] = useState<Message[]>([]);
	let [historyMsgs, messageStatus] = useFetch((targetUserCard && targetUserCard.id) ? `/messages/${userData.id}/${targetUserCard.id}`: null);
	
	useEventListener(connection.current, "message", incomingMsgHandler);

	useEffect(() => {
		(messageStatus === "fulfilled") && setMessages(historyMsgs.current);
	}, [historyMsgs, messageStatus]);

	function incomingMsgHandler(event: MessageEvent){
		let parsedMsg = JSON.parse(event.data);

		if (parsedMsg.senderId === targetUserCard?.friend?.id){
			setMessages(prev => [...prev, {
				id: parsedMsg.id,
				senderId: parsedMsg.senderId,
				content: parsedMsg.content
			}]);
		}
	}

	function handleSendingMsg(e: React.FormEvent<HTMLFormElement>) {
		let formControl = e.currentTarget.elements.namedItem("messageInput") as HTMLInputElement
		let inputText = formControl.value.trim();

		e.preventDefault();
		if (inputText.length !== 0){
			setMessages([
				...messages,
				{
					id: crypto.randomUUID(),
					senderId: currenctUser.id,
					content: inputText
				}
			])
			connection.current?.send(JSON.stringify(constructReq(currenctUser, targetUserCard?.friend as User, inputText)));
			setTimeout(() => changeUserView("Chats"), 300);
		}
		formControl.value = "";
	}

	function handleUserAction(e: React.MouseEvent<HTMLDivElement>, action: string){
		e.stopPropagation();
		switch (action){
			case "back":{
				changeUserView("contacts");
				console.log("user clicked Back");
				break ;
			}
			case "invite":{
				console.log("user clicked invite");
				break ;
			}
			case "block": {
				console.log("user clicked block");
				break ;
			}
		}
	}

	function handleToggelButton(){
		setShowActions(!showActions);
	}

	if (targetUserCard?.friend === undefined)
		return (
			<div id="ConversationPanel" className="h-full flex-2 bg-[#232c38] ml-4 pl-2 flex flex-col items-center justify-center">
				<img src="/src/assets/default-conversation.png" className="w-[68%]"  alt="decorator image for unselected conversation"/>
				<p className="text-gray-200 font-bold">Conversation missing. Target a conversation</p>
			</div>
		)
	return (
		<div key={targetUserCard.friend.id} id="ConversationPanel" className="h-full flex-2 bg-[#232c38] ml-4 pl-2 flex flex-col">
			<ChatHeader
				contact={targetUserCard.friend}
				isMobile={isMobile}
				UsersTab={UsersTab}
				showActions={showActions}
				presence={targetUserCard.presence}
				onTap={handleToggelButton}
				onAction={handleUserAction}
			/>
			<StatusResolver status={messageStatus} content={messages} view="Messages">
				<ChatBody senderUser={currenctUser} targetUser={targetUserCard.friend} messages={messages}/>
			</StatusResolver>
			<ChatInput onSend={handleSendingMsg}/>
		</div>
	);
}

export default ConversationPanel;