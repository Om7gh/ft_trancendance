import ChatHeader from "./ChatHeader.jsx";
import ChatBody from "./ChatBody.jsx";
import ChatInput from "./ChatInput.jsx";
import {useEffect} from "react";

function ConversationPanel({currenctUser, targetUserCard,screenWidth, messages, setMessages, socket}){
	useEffect(() => {
		async function getChatHistory() {
			let response = await fetch(`http://localhost:8080/messages/${currenctUser.id}/${targetUserCard.id}`);
			let conversations = await response.json();
		   return (conversations);
		}
		if (targetUserCard.id !== undefined && targetUserCard.id > 0){
			getChatHistory(targetUserCard.id).then((convs) => {
				setMessages(convs);
			});
		}
	}, [targetUserCard.friend]);

	function handleSendingMsg(e) {
		let inputText = e.target.elements.messageInput.value.trim();

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
			socket.send(JSON.stringify({
				action: "send-message",
				sender: {
					id: currenctUser.id,
					name: currenctUser.name,
					photo_url: currenctUser.photo_url
				},
				target: {
					id: targetUserCard.friend.id,
					name: targetUserCard.friend.name,
					photo_url: targetUserCard.friend.photo_url
				},
				content: inputText
			}));
		}
			
		e.target.elements.messageInput.value = "";
	}

	if (targetUserCard?.friend === undefined)
		return (
			<div id="ConversationPanel" className="h-full flex-2 bg-[#232c38] ml-4 pl-2 flex flex-col items-center justify-center">
				<img src="/src/assets/default-conversation.png" className="w-[68%]"  alt="decorator image for unselected conversation"/>
				<p className="text-white font-bold">Conversation missing. Target a conversation</p>
			</div>
		)
	return (
		<div key={targetUserCard.friend.id} id="ConversationPanel" className="h-full flex-2 bg-[#232c38] ml-4 pl-2 flex flex-col">
			<ChatHeader contact={targetUserCard.friend} screenWidth={screenWidth} presence={targetUserCard.presence}/>
			<ChatBody senderUser={currenctUser} targetUser={targetUserCard.friend} messages={messages}/>
			<ChatInput onMessageSend={handleSendingMsg}/>
		</div>
	);
}

export default ConversationPanel;