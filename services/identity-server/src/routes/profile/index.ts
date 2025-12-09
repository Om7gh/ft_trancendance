import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const token = request.cookies.accessToken
    if (!token) {
      // TODO redirect user to refresh /token
      return reply.unauthorized('you dont have permissions to see this page')
    }
    try {
      const { sub } = await request.verifyAccessToken()
      if (!sub) {
        return reply.send({ sub: sub })
      }
      const user = fastify.usersRepository.findByUID(sub)
      if (!user) {
        return reply.unauthorized('you dont have permissions to see this page')
      }
      console.log('access token is vaid')
      return reply.send({ success: `welcome back ${user.first_name}!` })
    } catch (err: any) {
      return reply.unauthorized(err)
    }
  })
}

export default plugin
