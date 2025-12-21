import { Avatar } from "../contacts/CardsList";
import {useRef, useEffect} from 'react';

import User from "../types/User"
import Message from "../types/Message"

interface MsgBubbleProps{
    user: User;
    msgContent: string;
}

interface MsgBubbleResolverProps{
    sender: User;
    target: User;
    message: Message;
}

interface ChatBodyProps{
    senderUser: User;
    targetUser: User;
    messages: Message[];
}

function IncomingMsgBubble({user, msgContent}: MsgBubbleProps){
    return (
        <div className="justify-start mt-3 flex gap-3">
            <Avatar imgUrl={user.photo_url} name={user.name} type="receiver"/>
            <p className="bg-[#0D9488]  text-gray-200 max-w-[50%] p-2 rounded-xl self-start rounded-bl-none break-all whitespace-pre-wrap">{msgContent}</p>
        </div>
    );
}

function OutgoingMsgBubble({user, msgContent}: MsgBubbleProps)
{
    return (
        <div className="justify-end mt-3 flex gap-3">
            <p className="bg-[#F97316] max-w-[50%] p-2 rounded-xl text-gray-200 rounded-br-none self-start break-all whitespace-pre-wrap">{msgContent}</p>
            <Avatar imgUrl={user.photo_url} name={user.name} type="sender"/>
        </div>
    );
}

function MsgBubbleResolverProps({sender, target, message}: MsgBubbleResolverProps)
{
    if (message.senderId === sender.id)
        return (<OutgoingMsgBubble key={message.id} user={sender} msgContent={message.content}/>);
    else if (message.senderId === target.id)
        return (<IncomingMsgBubble key={message.id} user={target} msgContent={message.content}/>);
}

function ChatBody({senderUser, targetUser, messages}: ChatBodyProps){
    
    let scrollableElement = useRef<HTMLDivElement | null >(null);
    useEffect(() => {
        let node = scrollableElement.current;
        node && (node.scrollTop = node.scrollHeight - node.clientHeight);
        return () => {
            node && (node.scrollTop = 0);
        };
    });

    return (
        <div ref={scrollableElement} id="chatBody" className="mb-4 p-2.5 scrollbar h-[75%] bg-[#232C38] flex overflow-auto flex-col">
            {messages?.map((message) => <MsgBubbleResolverProps sender={senderUser}  target={targetUser} message={message}/>)}
        </div>
    );
}

export default ChatBody;