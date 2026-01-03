import {useEffect, useMemo } from "react";
import type {Card} from "@/types/UserCard";

function usePresence(
	conversations: Card[],
	contacts: Card[],
	socket: React.RefObject<WebSocket | null>,
	socketState: string
){
	const presenceIds = useMemo(() => {
		const contactsIds = contacts.map(contact => contact.friend.id)
		const conversationIds = conversations.map(conv => conv.friend.id)
		return ([...contactsIds, ...conversationIds].sort().join());
	}, [conversations, contacts])

	useEffect(() => {
		if (socketState === "connected"){
			socket.current?.send(JSON.stringify({
				action: "watch-users",
				users: presenceIds?.split(",")
			}));
		}
	}, [socketState, presenceIds]);
}

export default usePresence;