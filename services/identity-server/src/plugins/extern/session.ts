import fastifySession, { FastifySessionOptions } from '@fastify/session'
import { FastifyInstance } from 'fastify'
import { PkceParams } from '../../auth/remote/types/pkce.js'
import { User } from '../../models/user.js'

type PendingUser = {
  id: number
  uid: string
  secret: string
  pending: boolean
}

declare module '@fastify/session' {
  interface FastifySessionObject {
    pkce: PkceParams
    pendingUser: PendingUser
    user: User
  }
}

export const autoConfig = (fastify: FastifyInstance): FastifySessionOptions => {
  return {
    secret: ['a-very-long-secret-key-with-minimum-32-chars'],
    cookie: {
      secure: false, // set true in production
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  }
}

export default fastifySession
