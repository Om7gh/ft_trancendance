import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { JWTPayload, jwtVerify } from 'jose'
import generateToken from '../../jwt/jose.js'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authenticate
    generateAccessToken: typeof generateAccessToken
    generateRefreshToken: typeof generateRefreshToken
    generateConfirmToken: typeof generateConfirmToken
  }
  interface FastifyRequest {
    verifyAccessToken: typeof verifyAccessToken
    verifyRefreshToken: typeof verifyRefreshToken
    verifyConfirmToken: typeof verifyConfirmToken
  }
  interface FastifyReply {
    sendAccessToken: typeof sendAccessToken
    clearAccessToken: typeof clearAccessToken
    sendRefreshToken: typeof sendRefreshToken
    clearRefreshToken: typeof clearRefreshToken
  }
}

async function authenticate(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const payload = await request.verifyAccessToken()
    const user = this.usersRepository.findByUID(payload.sub!)
    if (!user) {
      throw new Error('no user on the database')
    }
    request.session.user = user //* adding user touse on every function that should use user attrs
  } catch (err: any) {
    return reply.status(401).send({ error: err.message || 'Unauthorized' })
  }
}

async function generateAccessToken(this: FastifyInstance, uid: string): Promise<string> {
  return await generateToken({
    sub: uid,
    secret: this.tokenSecrets.accessToken,
    expiresIn: '1m', //TODO make it 15m
  })
}

function sendAccessToken(this: FastifyReply, accessToken: string): FastifyReply {
  return this.setCookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  })
}

async function verifyAccessToken(this: FastifyRequest): Promise<JWTPayload> {
  const token = this.cookies.accessToken
  if (!token) {
    throw new Error('no access token provided!')
  }
  const { payload } = await jwtVerify(token, Buffer.from(this.server.tokenSecrets.accessToken))
  return payload
}

function clearAccessToken(this: FastifyReply): FastifyReply {
  return this.clearCookie('accessToken', { path: '/' })
}

async function generateRefreshToken(
  this: FastifyInstance,
  uid: string,
  jti: string
): Promise<string> {
  return await generateToken({
    sub: uid,
    jti: jti,
    secret: this.tokenSecrets.refreshToken,
    expiresIn: '7d',
  })
}

function sendRefreshToken(this: FastifyReply, refreshToken: string): FastifyReply {
  return this.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 60 * 60 * 24 * 7,
  })
}

async function verifyRefreshToken(this: FastifyRequest): Promise<JWTPayload> {
  const token = this.cookies.refreshToken
  if (!token) {
    throw new Error('no refresh token provided!')
  }
  const { payload } = await jwtVerify(token, Buffer.from(this.server.tokenSecrets.refreshToken))
  return payload
}

function clearRefreshToken(this: FastifyReply): FastifyReply {
  return this.clearCookie('refreshToken', { path: '/token' })
}

async function generateConfirmToken(this: FastifyInstance, uid: string): Promise<string> {
  return await generateToken({
    sub: uid,
    secret: this.tokenSecrets.confirmToken,
    expiresIn: '5m',
  })
}

async function verifyConfirmToken(this: FastifyRequest): Promise<JWTPayload> {
  const { token } = this.query as { token: string }
  if (!token) {
    throw new Error('no token provided!')
  }
  const { payload } = await jwtVerify(token, Buffer.from(this.server.tokenSecrets.confirmToken))
  return payload
}

export default fp(
  async (fastify) => {
    fastify.decorate('authenticate', authenticate)
    fastify.decorate('generateAccessToken', generateAccessToken)
    fastify.decorate('generateRefreshToken', generateRefreshToken)
    fastify.decorate('generateConfirmToken', generateConfirmToken)
    fastify.decorateRequest('verifyAccessToken', verifyAccessToken)
    fastify.decorateRequest('verifyRefreshToken', verifyRefreshToken)
    fastify.decorateRequest('verifyConfirmToken', verifyConfirmToken)
    fastify.decorateReply('sendAccessToken', sendAccessToken)
    fastify.decorateReply('clearAccessToken', clearAccessToken)
    fastify.decorateReply('sendRefreshToken', sendRefreshToken)
    fastify.decorateReply('clearRefreshToken', clearRefreshToken)
  },
  { name: 'jwt' }
)
