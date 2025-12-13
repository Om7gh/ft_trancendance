import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyReply, FastifyRequest } from 'fastify';
import { hash } from '../../auth/security/cipher-util.js';
import AuthController from '../../controllers/AuthController.js';
import { asUserInfo } from '../../dto/user-dto.js';
import { resetPasswordOptions } from '../../utils/mail-options.js';

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
      const { username } = request.body as { username: string };
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

  fastify.get(
    '/userinfo',
    { onRequest: fastify.authenticate },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const userInfo = asUserInfo(request.session.user);
      request.session.destroy();
      reply.clearCookie('sessionId');
      return reply.send(userInfo);
    }
  );

  fastify.post(
    '/forgot-password',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { email } = request.body as { email: string };
      const user = fastify.usersRepository.findByEmail(email);
      if (!user) {
        return reply.notFound('this email not linked with any PONG account');
      }
      if (user.provider !== 'local') {
        return reply.forbidden(
          'if this email registred locally check your email box to reset password'
        );
      }
      const token = await fastify.generateConfirmToken(user.email);
      const url = `${fastify.config.HOST}:${fastify.config.PORT}/auth/reset-password?token=${token}`;
      await fastify.transporter.sendMail(resetPasswordOptions(user.email, url));
      reply.send({
        success: true,
        message: 'please check your email, we send a reset email for you.',
        next: null,
      });
    }
  );

  fastify.post(
    '/reset-password',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { newPassword, confirmPassword } = request.body as {
        newPassword: string;
        confirmPassword: string;
      };

      try {
        const token = await request.verifyConfirmToken();
        if (!token) {
          return reply.badRequest('invalid token');
        }
        const user = fastify.usersRepository.findByEmail(token.sub!);
        if (!user) {
          return reply.badRequest('no user found with this email');
        }
        if (newPassword !== confirmPassword) {
          return reply.badRequest('password not match confirm password');
        }
        const hashedPassword = hash(newPassword);
        fastify.usersRepository.update(user.id, { password: hashedPassword });
        return reply.send({
          success: true,
          message: 'password changed successfuly',
          next: null,
        });
      } catch (err: any) {
        return reply.code(401).send({
          success: false,
          message: err.message || 'error',
          next: null,
        });
      }
    }
  );
};

export default plugin;
