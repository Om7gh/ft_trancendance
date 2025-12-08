import { JwtPayload } from '../payloads/jwt.js'

export interface DiscordPayload extends Partial<JwtPayload> {
  username: string
  discriminator: string
  avatar: string
  locale: string
  verified: boolean
}
