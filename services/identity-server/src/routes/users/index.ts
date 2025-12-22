import { FastifyPluginAsync } from 'fastify';
import { UserController } from '../../controllers/UserController.js';
import { UsernameSchema } from '../../schemas/auth.js';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get(
        '/:username',
        {
            onRequest: [fastify.authenticate],
            schema: { params: UsernameSchema },
        },
        UserController.user
    );

    fastify.get(
        '/search',
        { onRequest: [fastify.authenticate] },
        UserController.search
    );
};

export default root;
