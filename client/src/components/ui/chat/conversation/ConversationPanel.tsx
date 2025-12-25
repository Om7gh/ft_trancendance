import ChatBody from "./ChatBody.tsx";
import ChatInput from "./ChatInput.tsx";
import ChatHeader from "./ChatHeader.tsx";
import StatusResolver from "../contacts/JsxByStatus.tsx";
import useAxios from "@/hooks/useAxios.ts";
import useEventListener from "@/hooks/useEventListener.ts";
import {useEffect, useContext, useState} from "react";
import { GlobalContext } from "@/App.tsx";

import type {Card} from "@/types/UserCard.ts"
import type {User} from "@/types/User.ts"
import type {User as GloblaUser} from "@/App.tsx"
import type {Message} from "@/types/Message.ts"

import ConversationImg from "@assets/placeholders/conversation-placeholder.png";

interface ConversationPanelProps{
	targetUserCard: Card | null;
	UsersTab: string;
	isMobile: boolean;
	connection: React.RefObject<WebSocket | null>;
	changeUserView: (view: string) => void;
}

function constructReq(sender: User | null, target: User, content: string){
	return ({
		action: "send-message",
		sender: sender,
		target: target,
		content: content
	});
}

function ConversationPanel({
	UsersTab,
	targetUserCard,
	isMobile,
	connection,
	changeUserView
}: ConversationPanelProps){
	const userInfo  = useContext(GlobalContext);
	const [showActions, setShowActions] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [historyMsgs, messageStatus] = useAxios( (targetUserCard && targetUserCard.id)
			? `/messages/${targetUserCard.id}` 
			: null);
	
	useEventListener(connection.current, "message", incomingMsgHandler);

	const {id, first_name: name, avatar: photo_url} = userInfo?.user as GloblaUser;
	const currentUser: User = {id, name, photo_url};

	useEffect(() => {
		if (messageStatus === "fulfilled") {
			setMessages(historyMsgs.current);
		}
	}, [historyMsgs, messageStatus]);

	function incomingMsgHandler(event: MessageEvent){
		const parsedMsg = JSON.parse(event.data);

		if (parsedMsg.senderId === targetUserCard?.friend?.id){
			setMessages(prev => [...prev, {
				id: parsedMsg.id,
				senderId: parsedMsg.senderId,
				content: parsedMsg.content
			}]);
		}
	}

	function handleSendingMsg(e: React.FormEvent<HTMLFormElement>) {
		const formControl = e.currentTarget.elements.namedItem("messageInput") as HTMLInputElement
		const inputText = formControl.value.trim();

		e.preventDefault();
		if (inputText.length !== 0){
			setMessages([
				...messages,
				{
					id: crypto.randomUUID(),
					senderId: currentUser.id,
					content: inputText
				}
			])
			connection.current?.send(JSON.stringify(constructReq(currentUser, targetUserCard?.friend as User, inputText)));
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
			<div id="ConversationPanel" className="h-full flex-2 ml-4 pl-2 flex flex-col items-center justify-center">
				<img src={ConversationImg} className="w-[68%]"  alt="decorator image for unselected conversation"/>
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
				<ChatBody senderUser={currentUser} targetUser={targetUserCard.friend} messages={messages}/>
			</StatusResolver>
			<ChatInput onSend={handleSendingMsg}/>
		</div>
	);
}

export default ConversationPanel;