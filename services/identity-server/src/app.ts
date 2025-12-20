import AutoLoad from '@fastify/autoload';
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify';
import path from 'node:path';

export const options: FastifyServerOptions = {
  ignoreTrailingSlash: true, //! to be kept in production
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    },
  },
};

export default async function um(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  await fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'plugins/extern'),
    options: {},
  });

  fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'plugins/app'),
    options: { ...opts },
  });

  fastify.register(AutoLoad, {
    dir: path.join(import.meta.dirname, 'routes'),
    autoHooks: true,
    cascadeHooks: true,
    options: { ...opts },
  });

  fastify.setErrorHandler(
    (err: any, request: FastifyRequest, reply: FastifyReply) => {
      if (!err.statusCode || err.statusCode >= 500) {
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
        );
      }
      reply.code(err.statusCode ?? 500);

      let message = 'Internal Server Error';
      if (err.statusCode && err.statusCode < 500) {
        message = err.message;
      }

      return { message };
    }
  );

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
      );

      reply.code(404);

      return { message: 'Not Found' };
    }
  );
}
