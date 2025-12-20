import multipart, { FastifyMultipartOptions } from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp<FastifyMultipartOptions>(async (fastify: FastifyInstance) => {
    fastify.register(multipart, {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    });
});
