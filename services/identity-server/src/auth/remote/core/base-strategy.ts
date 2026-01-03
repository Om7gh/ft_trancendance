import { JwtPayload } from '../payloads/jwt.js'
import { PkceParams } from '../types/pkce.js'
import { CredentialBody, TokensResponse } from '../types/provider-credentials.js'

export default abstract class AStrategy {
  abstract readonly name: string
  abstract readonly baseUrl: string
  abstract readonly tokenUrl: string
  abstract readonly scope: string[]

  constructor(public readonly credentials: CredentialBody) {}

  generateAuthUrl(pkce: PkceParams): string {
    if (!this.scope.length) {
      throw new Error('Missing required field: scope')
    }

    const params = new URLSearchParams({
      client_id: this.credentials.clientId,
      redirect_uri: this.credentials.redirectURI,
      response_type: 'code',
      scope: this.scope.join(' '),
    })

    if (pkce) {
      params.set('state', pkce.state)
      params.set('code_challenge', pkce.codeChallenge)
      params.set('code_challenge_method', 'S256')
    }
    params.set('prompt', 'consent')
    return `${this.baseUrl}?${params.toString()}`
  }

  async getTokens(code: string, pkce: PkceParams): Promise<TokensResponse> {
    const params = new URLSearchParams({
      code,
      code_verifier: pkce.codeVerifier,
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.credentials.redirectURI,
    })
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Token request failed: ${response.status} ${text}`)
    }
    return (await response.json()) as TokensResponse
  }

  abstract getUserInfo(tokens: TokensResponse): Promise<JwtPayload>
}
