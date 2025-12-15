import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyReply, FastifyRequest } from 'fastify';
import AuthController from '../../controllers/AuthController.js';
import { PasswordController } from '../../controllers/PasswordController.js';
import { asUserInfo } from '../../dto/user-dto.js';

const LoginCredentials = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

const RegisterCredentials = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  first_name: Type.String(),
  last_name: Type.Optional(Type.String()),
});

const ConfirmToken = Type.Object({
  token: Type.String(),
});

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
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { username } = request.body as { username: string };
      if (!request.session.pendingUser) {
        return reply.badRequest('no pending authentication');
      }
      try {
        const { id } = request.session.pendingUser;
        const user = fastify.usersRepository.findById(id);
        if (!user) {
          return reply.forbidden('user not found');
        }
        if (user.username) {
          return reply.forbidden('username already setted');
        }
        const isTaken = fastify.usersRepository.findByUsername(username);
        if (isTaken) {
          return reply.conflict('this username is taken');
        }
        return reply.send({ success: true });
      } catch (err: any) {
        return reply.badRequest(
          'error happen when user trying to choose username'
        );
      }
    }
  );

  fastify.post(
    '/set-username',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { username } = request.body as { username: string };
      if (!request.session.pendingUser) {
        return reply.badRequest('no pending authentication');
      }
      try {
        const { id } = request.session.pendingUser;
        const user = fastify.usersRepository.findById(id);
        if (!user) {
          return reply.forbidden('user not found');
        }
        if (user.username) {
          return reply.forbidden('username already setted');
        }
        const isTaken = fastify.usersRepository.findByUsername(username);
        if (isTaken) {
          return reply.conflict('this username is taken');
        }
        fastify.usersRepository.update(id, { username: username });
        return reply.send({ success: true });
      } catch (err: any) {
        return reply.badRequest('set-username: error');
      }
    }
  );

  fastify.get(
    '/userinfo',
    { onRequest: fastify.authenticate },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const userInfo = asUserInfo(request.session.user);
      return reply.send(userInfo);
    }
  );

  fastify.post('/forgot-password', PasswordController.forgotPassword);

  fastify.post('/reset-password', PasswordController.resetPassword);
};

export default plugin;
