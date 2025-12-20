import fastifyStatic, { FastifyStaticOptions } from '@fastify/static';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp<FastifyStaticOptions>(async (fastify: FastifyInstance) => {
    fastify.register(fastifyStatic, {
        root: '/var/avatars',
        prefix: '/avatars/',
    });
});
