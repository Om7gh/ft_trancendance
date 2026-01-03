import type {User} from './User'
export  interface Card{
    id: number;
    friend: User;
    unread_msg: number;
    presence: string;
    lastMsg: string;
}