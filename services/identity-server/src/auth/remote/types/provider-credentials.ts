export type CredentialBody = {
  clientId: string
  clientSecret: string
  redirectURI: string
}

export type TokensResponse = {
  state: string
  scope: string
  id_token: string
  token_type: string
  access_token: string
  refresh_token: string
  expires_in: number
}
