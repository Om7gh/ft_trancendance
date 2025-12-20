import fp from 'fastify-plugin';
import cors from '@fastify/cors';


export default fp(async function corsPlugin(fastify, options) {
    fastify.register(cors, {
        origin: '*',
        methods: ['GET'],
        credentials: true,
    });
});
