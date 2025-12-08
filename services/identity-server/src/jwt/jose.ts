import { SignJWT } from 'jose'

type TokenOptions = {
  sub: string
  jti?: string
  secret: string
  expiresIn: string
}

export default async function generateToken(opts: TokenOptions): Promise<string> {
  const jwt = new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(opts.sub)
    .setIssuer('transcender')
    .setIssuedAt()
    .setExpirationTime(opts.expiresIn)
  if (opts.jti) jwt.setJti(opts.jti)
  return jwt.sign(Buffer.from(opts.secret))
}
