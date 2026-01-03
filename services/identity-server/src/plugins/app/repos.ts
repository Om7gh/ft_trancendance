import fp from 'fastify-plugin'
import { UserRepository, FriendshipRepository } from '../../repositories/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    usersRepository: UserRepository
    friendshipRepository: FriendshipRepository
  }
}

export default fp(
  async (fastify) => {
    fastify.decorate('usersRepository', new UserRepository(fastify.db))
    fastify.decorate('friendshipRepository', new FriendshipRepository(fastify.db))
  },
  { name: 'usersRepository' }
)
