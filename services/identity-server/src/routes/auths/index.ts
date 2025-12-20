import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import AuthController from '../../controllers/AuthController.js';
import { PasswordController } from '../../controllers/PasswordController.js';
import {
  ConfirmToken,
  LoginCredentials,
  RegisterCredentials,
  UsernameSchema,
} from '../../schemas/auth.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/signup',
    { schema: { body: RegisterCredentials } },
    AuthController.signup
  );

  fastify.post(
    '/login',
    { schema: { body: LoginCredentials } },
    AuthController.login
  );

  fastify.post('/logout', AuthController.logout);

  fastify.get(
    '/confirm',
    { schema: { querystring: ConfirmToken } },
    AuthController.confirmEmail
  );

  fastify.post(
    '/check-username',
    { schema: { body: UsernameSchema } },
    AuthController.checkUsername
  );

  fastify.post(
    '/set-username',
    { schema: { body: UsernameSchema } },
    AuthController.setUsername
  );

  fastify.post('/complete-profile', AuthController.completeProfile);

  fastify.get(
    '/userinfo',
    { onRequest: fastify.authenticate },
    AuthController.userInfo
  );

  fastify.post('/forgot-password', PasswordController.forgotPassword);

  fastify.post('/reset-password', PasswordController.resetPassword);
};

export default plugin;
