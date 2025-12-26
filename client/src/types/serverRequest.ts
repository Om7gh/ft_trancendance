import type {User} from "./User"

interface BlockToggle{
    action: "block" | "unblock";
    targetID: string
}

interface SendMessage{
    action: "send-message"
    sender: User;
    target: User;
    content: string;
}

interface ConversationInOut{
    action: "enter-conversation" | "leave-conversation";
    conversationId: number;
}


interface WatchUsers{
    users: number[]
}

export type ServerRequest = BlockToggle | SendMessage | ConversationInOut | WatchUsers;
