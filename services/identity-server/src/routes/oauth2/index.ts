import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import asUser from '../../dto/user-dto.js'
import { User } from '../../models/user.js'

const ParamsSchema = Type.Object({
  provider: Type.String(),
})

const QuerySchema = Type.Object({
  state: Type.String(),
  code: Type.Optional(Type.String()),
  error: Type.Optional(Type.String()),
})

const CallbackSchema = { params: ParamsSchema, querystring: QuerySchema }

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get('/:provider', { schema: { params: ParamsSchema } }, async function (request, reply) {
    const provider = request.params.provider
    if (!fastify.auth.isSupported(provider)) {
      throw fastify.httpErrors.notFound(`Provider '${provider}' is not supported`)
    }
    request.session.pkce = fastify.pkce.getParams()
    const url = fastify.auth.getAuthUrl(provider, request.session.pkce)
    reply.redirect(url)
  })

  fastify.get('/:provider/callback', { schema: CallbackSchema }, async function (request, reply) {
    const provider = request.params.provider
    const { state, code, error } = request.query
    if (error) {
      console.error(`OAuth error from ${provider}: ${error}`)
      request.session.destroy((err) => {
        if (err) console.error('failed to destroy session:', err)
      })
      reply.clearCookie('sessionId', { path: '/' })

      const errorMsg = encodeURIComponent('authentication failed: ' + (error || 'unknown error'))
      return reply.redirect(`/login?oauth_error=${errorMsg}`)
    }
    if (!code || !state) {
      return reply.code(400).send({ success: false, message: error ?? 'missing code or state' })
    }
    if (!request.session?.pkce) {
      return reply.redirect(`/oauth2/${provider}`)
    }
    if (request.session.pkce.state !== state) {
      request.session.destroy()
      reply.clearCookie('sessionId', { path: '/' })
      throw fastify.httpErrors.badRequest('invalid state parameter')
    }
    const strategy = fastify.auth.use(provider)
    const tokens = await strategy.getTokens(code, request.session.pkce)
    request.session.destroy()
    reply.clearCookie('sessionId', { path: '/' })
    const payload = await strategy.getUserInfo(tokens)
    if (!payload || !payload.email) {
      throw reply.badRequest('email not found in OAuth payload')
    }
    let user = fastify.usersRepository.findOrCreate(asUser(provider, payload) as User)
    fastify.log.info(user)
    reply.send({ user: user })
  })
}

export default plugin
