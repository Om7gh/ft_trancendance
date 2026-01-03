export interface User {
  id: number
  uid: string
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  avatar: string | null
  bio: string | null
  created_at: number
  updated_at: number
  last_login: number
  last_logout: number | null
  email_verified: 0 | 1
  provider: string
  token_id: string | null
  token_updated_at: number
  mfa_enabled: 0 | 1
  mfa_secret: string | null
}

export interface TwoFactor {
  id: number
  user_id: number
  secret: string
  enabled: 0 | 1
  created_at: number
}
