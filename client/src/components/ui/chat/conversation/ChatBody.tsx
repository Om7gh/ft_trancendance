import { Avatar } from "../contacts/CardsList.tsx"
import {useRef, useEffect} from 'react';

import type {User} from "@/types/User"
import type {Message} from "@/types/Message"

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
			<p className="bg-violet-500  text-gray-200 max-w-[50%] p-2 rounded-xl self-start rounded-bl-none break-all whitespace-pre-wrap">
				{msgContent}
			</p>
		</div>
	);
}

function OutgoingMsgBubble({user, msgContent}: MsgBubbleProps)
{
	return (
		<div className="justify-end mt-3 flex gap-3">
			<p className="bg-neon max-w-[50%] p-2 rounded-xl text-gray-200 rounded-br-none self-start break-all whitespace-pre-wrap">
				{msgContent}
			</p>
			<Avatar imgUrl={user.photo_url} name={user.name} type="sender"/>
		</div>
	);
}

function MsgBubbleResolverProps({sender, target, message}: MsgBubbleResolverProps)
{
	if (message.senderID === sender.id)
		return (<OutgoingMsgBubble user={sender} msgContent={message.content}/>);
	else if (message.senderID === target.id)
		return (<IncomingMsgBubble user={target} msgContent={message.content}/>);
}

function ChatBody({senderUser, targetUser, messages}: ChatBodyProps){
	
	const scrollableElement = useRef<HTMLDivElement | null >(null);
	useEffect(() => {
		const node = scrollableElement.current;
		if (node)
			(node.scrollTop = node.scrollHeight - node.clientHeight);
		return () => {
			if (node)
				(node.scrollTop = 0);
		};
	});

	return (
		<div ref={scrollableElement} id="chatBody" className="h-full mb-1 bg-slate-800/40 p-4 scrollbar flex overflow-auto flex-col">
			{messages?.map((message) => <MsgBubbleResolverProps sender={senderUser}  target={targetUser} message={message}/>)}
		</div>
	);
}

export default ChatBody;