import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyReply, FastifyRequest } from 'fastify';
import { hash } from '../../auth/security/cipher-util.js';
import AuthController from '../../controllers/AuthController.js';
import { asUserInfo } from '../../dto/user-dto.js';
import { PasswordController } from '../../controllers/PasswordController.js';

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
    'check-username',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { username } = request.query as { username: string };
      try {
        const uid = request.session.user.uid; //?HINT this setted in when user click confirmation token
        if (!uid) {
          return reply.forbidden('user not found');
        }
        const user = fastify.usersRepository.findByUID(uid);
        if (user?.username !== undefined) {
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

  fastify.post('/forgot-password',
    PasswordController.forgotPassword
  );

  fastify.post('/reset-password',
    PasswordController.resetPassword
  );
};

export default plugin;
