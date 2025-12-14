import { Avatar } from "../contacts/CardsList";
import {useRef, useEffect} from 'react';

function IncomingMsgBubble({targetUser, msgContent}){
    return (
        <div className="justify-start mt-3 flex gap-3">
            <Avatar imgUrl={targetUser.photo_url} name={targetUser.name} type="receiver"/>
            <p className="bg-[#0D9488]  text-gray-200 max-w-[50%] p-2 rounded-xl self-start rounded-bl-none break-all whitespace-pre-wrap">{msgContent}</p>
        </div>
    );
}

function OutgoingMsgBubble({senderUser, msgContent})
{
    return (
        <div className="justify-end mt-3 flex gap-3">
            <p className="bg-[#F97316] max-w-[50%] p-2 rounded-xl text-gray-200 rounded-br-none self-start break-all whitespace-pre-wrap">{msgContent}</p>
            <Avatar imgUrl={senderUser.photo_url} name={senderUser.name} type="sender"/>
        </div>
    );
}

function buildMsgBubble(sender, target, message)
{
    if (message.senderId === sender.id)
        return (<OutgoingMsgBubble key={message.id} senderUser={sender} msgContent={message.content}/>);
    else if (message.senderId === target.id)
        return (<IncomingMsgBubble key={message.id} targetUser={target} msgContent={message.content}/>);
}

function ChatBody({senderUser, targetUser, messages}){
    let scrollableElement = useRef(null);

    useEffect(() => {
        let node = scrollableElement.current;
        node.scrollTop = node.scrollHeight - node.clientHeight;
        return () => {
            node.scrollTop = 0;
        };
    });

    return (
        <div ref={scrollableElement}  id="chatBody" className="mb-4 p-2.5 scrollbar h-[75%] bg-[#232C38] flex overflow-auto flex-col">
            {messages?.map((message) => buildMsgBubble(senderUser, targetUser, message))}
        </div>
    );
}

export default ChatBody;