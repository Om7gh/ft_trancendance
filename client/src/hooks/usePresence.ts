import {useEffect, useMemo } from "react";
import Card from "../src/types/UserCard";

function usePresence(conversations: Card[], contacts: Card[], socket: React.RefObject<WebSocket | null>){

    let presenceIds = useMemo(() => {
        const contactsIds = contacts.map(contact => contact.friend.id)
        const conversationIds = conversations.map(conv => conv.friend.id)
        return ([...contactsIds, ...conversationIds].sort().join());
    }, [conversations, contacts])

    useEffect(() => {
        if (socket.current?.readyState === WebSocket.OPEN){
            socket.current.send(JSON.stringify({
                action: "watch-users",
                users: presenceIds.split(",")
            }));
        }
    }, [socket, presenceIds]);
}

export default usePresence;