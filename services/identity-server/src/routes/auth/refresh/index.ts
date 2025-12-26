import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import TokenController from '../../../controllers/TokenController.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/', TokenController.generate);
};

export default plugin;
