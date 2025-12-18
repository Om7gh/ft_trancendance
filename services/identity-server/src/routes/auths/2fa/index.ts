//2x2 Mar vs Jor
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import MFAController from '../../../controllers/2FAController.js';
import { TwoFASchema } from '../../../schemas/auth.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/setup',
    {
      onRequest: [fastify.authenticate],
      config: {
        rateLimit: {
          max: 3, // allow 3 calls
          timeWindow: '1m', // per minute
          keyGenerator: (req) => req.session.user.id, // rate-limit per user
        },
      },
    },
    MFAController.setup
  );

  fastify.post(
    '/verify',
    { onRequest: [fastify.authenticate], schema: { body: TwoFASchema } },
    MFAController.verify
  );

  fastify.post(
    '/disable',
    { onRequest: [fastify.authenticate], schema: { body: TwoFASchema } },
    MFAController.disable
  );

  fastify.post(
    '/verify-login',
    { schema: { body: TwoFASchema } },
    MFAController.verifyLogin
  );
};

export default plugin;
