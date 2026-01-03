import { type Database as BetterDatabase } from 'better-sqlite3'
import fp from 'fastify-plugin'
import { DatabaseManager, initializeSchema } from '../../database/index.js'

declare module 'fastify' {
  interface FastifyInstance {
    db: BetterDatabase
  }
}

export default fp(
  async (fastify) => {
    const db = DatabaseManager.open('/var/lib/um/users.sqlite3')
    initializeSchema(db)

    fastify.decorate('db', db)

    fastify.addHook('onClose', async () => {
      fastify.log.info('Closing database connection...')
      DatabaseManager.close()
    })
  },
  { name: 'db' }
)
