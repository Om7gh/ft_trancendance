import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import AuthController from '../../controllers/AuthController.js';
import { CallbackSchema, OAuth2Schema } from '../../schemas/auth.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/:provider',
    { schema: { params: OAuth2Schema } },
    AuthController.redirect
  );

  fastify.get(
    '/:provider/callback',
    { schema: CallbackSchema },
    AuthController.oauth2Login
  );
};

export default plugin;
