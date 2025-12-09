import crypto from 'crypto'
import { PkceParams } from '../remote/types/pkce.js'

export default class Pkce {
  private static generateState() {
    return crypto.randomBytes(32).toString('hex')
  }

  private static generateCodeVerifier(): string {
    return crypto.randomBytes(64).toString('base64url')
  }

  private static generateCodeChallenge(verifier: string): string {
    return crypto.createHash('sha256').update(verifier).digest('base64url')
  }

  public static getParams(): PkceParams {
    const codeVerifier = this.generateCodeVerifier()
    return {
      state: this.generateState(),
      codeVerifier: codeVerifier,
      codeChallenge: this.generateCodeChallenge(codeVerifier),
    }
  }
}
