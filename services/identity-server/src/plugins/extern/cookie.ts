import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import fp from 'fastify-plugin'

export default fp<FastifyCookieOptions>(async (fastify) => {
  fastify.register(cookie, {
    secret: 'your-secret-key', // for signed cookies
    parseOptions: {}, // optional: options for cookie.parse
  })
})
