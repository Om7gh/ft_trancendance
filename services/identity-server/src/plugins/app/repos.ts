import fp from 'fastify-plugin'
import { TwoFactorRepository, UserRepository, FriendshipRepository } from '../../repositories/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    usersRepository: UserRepository
    mfaRepository: TwoFactorRepository
    friendshipRepository: FriendshipRepository
  }
}

export default fp(
  async (fastify) => {
    fastify.decorate('usersRepository', new UserRepository(fastify.db))
    fastify.decorate('mfaRepository', new TwoFactorRepository(fastify.db))
    fastify.decorate('friendshipRepository', new FriendshipRepository(fastify.db))
  },
  { name: 'usersRepository' }
)
