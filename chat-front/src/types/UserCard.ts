import User from './User'

interface Card{
    id: number,
    friend: User,
    unread_msg: number,
    presence: string
}

export default Card;