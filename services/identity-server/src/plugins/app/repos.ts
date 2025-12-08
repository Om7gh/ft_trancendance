import fp from 'fastify-plugin'
import { TwoFactorRepository, UserRepository } from '../../repositories/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    usersRepository: UserRepository
    mfaRepository: TwoFactorRepository
  }
}

export default fp(
  async (fastify) => {
    fastify.decorate('usersRepository', new UserRepository(fastify.db))
    fastify.decorate('mfaRepository', new TwoFactorRepository(fastify.db))
  },
  { name: 'usersRepository' }
)
