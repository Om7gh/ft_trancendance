import cors, { FastifyCorsOptions } from '@fastify/cors';
import fp from 'fastify-plugin';

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: 'http://localhost:8080',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
});
