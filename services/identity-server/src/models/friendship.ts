export interface Friendship {
  id: number
  sender_id: number
  receiver_id: number
  sender_username: string
  receiver_username: string
  sender_fullname: string
  receiver_fullname: string
  sender_avatar: string
  receiver_avatar: string
  status: number
  created_at: number
  updated_at: number
}

export interface Friend {
  username: string
  fullname: string
  avatar: string
  friends_since?: Friendship['updated_at']
}