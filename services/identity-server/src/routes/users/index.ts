import { FastifyPluginAsync } from 'fastify';
import { UserController } from '../../controllers/UserController.js';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get(
        '/search',
        { onRequest: [fastify.authenticate] },
        UserController.search
    );
};

export default root;
