import { FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok' };
  });
};

export default health;
