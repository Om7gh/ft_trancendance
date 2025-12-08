import { OAuth2Client } from 'google-auth-library'
import AStrategy from '../core/base-strategy.js'
import { JwtPayload } from '../payloads/jwt.js'
import { TokensResponse } from '../types/provider-credentials.js'

export default class Google extends AStrategy {
  readonly name = 'google'
  readonly tokenUrl = 'https://oauth2.googleapis.com/token'
  readonly scope: string[] = ['openid', 'profile', 'email']
  readonly baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  async getUserInfo(tokens: TokensResponse): Promise<JwtPayload> {
    if (!tokens.id_token) {
      throw new Error('GoogleProvider: missing id_token')
    }
    const client = new OAuth2Client(this.credentials.clientId)
    const ticket = client.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.credentials.clientId,
    })
    const payload = (await ticket).getPayload()
    if (!payload) {
      throw new Error('GoogleProvider: failed to retrieve user info')
    }

    return payload as JwtPayload
  }
}
