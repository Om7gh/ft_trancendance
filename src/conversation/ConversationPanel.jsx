import ChatHeader from "./ChatHeader.jsx";
import ChatBody from "./ChatBody.jsx";
import ChatInput from "./ChatInput.jsx";
import {useEffect} from "react";
import conversation from '../conversation/messagesObj.jsx'

function ConversationPanel({currenctUser, targetUser, screenWidth, messages, setMessages}){

    useEffect(() => {
        setMessages(JSON.parse(conversation).messages);
    }, [targetUser]);

    function handleSendingMsg(e) {
        let inputText = e.target.elements.messageInput.value.trim();

        e.preventDefault();

        inputText.length !== 0 && setMessages([
                ...messages,
                {
                    sender: currenctUser.id,
                    content: inputText
                }
            ])
        e.target.elements.messageInput.value = "";
    }

    if (targetUser === null)
        return (
            <div id="ConversationPanel" className="h-full flex-2 bg-[#232c38] ml-4 pl-2 flex flex-col items-center justify-center">
                <img src="/src/assets/default-conversation.png" className="w-[68%]"  alt="decorator image for unselected conversation"/>
                <p className="text-white font-bold">Conversation missing. Target a conversation</p>
            </div>
        )
    return (
        <div id="ConversationPanel" className="h-full flex-2 bg-[#232c38] ml-4 pl-2 flex flex-col">
            <ChatHeader contact={targetUser} screenWidth={screenWidth}/>
            <ChatBody senderUser={currenctUser} targetUser={targetUser} messages={messages}/>
            <ChatInput onMessageSend={handleSendingMsg}/>
        </div>
    );
}

export default ConversationPanel;