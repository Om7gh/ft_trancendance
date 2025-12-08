import AutoLoad from '@fastify/autoload'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import path from 'node:path'


export default async function um(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  await fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'plugins/extern'),
    options: {},
  })

  fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'plugins/app'),
    options: { ...opts },
  })

  fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'routes'),
    autoHooks: true,
    cascadeHooks: true,
    options: { ...opts },
  })

  fastify.setErrorHandler((err: any, request, reply) => {
    fastify.log.error(
      {
        err,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      'Unhandled error occurred'
    )

    reply.code(err.statusCode ?? 500)

    let message = 'Internal Server Error'
    if (err.statusCode && err.statusCode < 500) {
      message = err.message
    }

    return { message }
  })

  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 3,
        timeWindow: 500,
      }),
    },
    (request, reply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        'Resource not found'
      )

      reply.code(404)

      return { message: 'Not Found' }
    }
  )
}
