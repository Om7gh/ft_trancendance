import { FastifyPluginAsync } from 'fastify';
import { UserController } from '../../controllers/UserController.js';
import { UsernameBody } from '../../schemas/auth.js';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get<{ Params: UsernameBody }>(
        '/:username',
        { onRequest: [fastify.authenticate] },
        UserController.user
    );

    fastify.get(
        '/search',
        { onRequest: [fastify.authenticate] },
        UserController.search
    );
};

export default root;
