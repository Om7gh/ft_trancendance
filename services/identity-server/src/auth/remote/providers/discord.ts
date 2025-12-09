import AStrategy from '../core/base-strategy.js'
import { JwtPayload } from '../payloads/jwt.js'
import { TokensResponse } from '../types/provider-credentials.js'

export default class Discord extends AStrategy {
  readonly name = 'discord'
  readonly baseUrl = 'https://discord.com/oauth2/authorize'
  readonly tokenUrl = 'https://discord.com/api/oauth2/token'
  readonly scope: string[] = ['identify', 'email']

  async getUserInfo(tokens: TokensResponse): Promise<JwtPayload> {
    const response = await fetch('https://discord.com/api/users/@me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Discord getUserInfo failed: ${response.status} ${text}`)
    }
    return (await response.json()) as JwtPayload
  }
}
