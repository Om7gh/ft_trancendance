import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { compare, hash } from '../../auth/security/cipher-util.js';
import { asUserInfo } from '../../dto/user-dto.js';
import { User } from '../../models/user.js';
import { confirmMailOptions, resetPasswordOptions } from '../../utils/mail-options.js';

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

type LoginBody = Static<typeof LoginCredentials>;
type RegisterBody = Static<typeof RegisterCredentials>;

const ConfirmToken = Type.Object({
  token: Type.String(),
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/signup',
    { schema: { body: RegisterCredentials } },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const payload = request.body as RegisterBody;
      const exists = fastify.usersRepository.findByEmail(payload.email);
      if (exists) {
        return reply.conflict('an account with this email already exists');
      }

      const newUser = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: hash(payload.password),
        avatar: `https://avatar.iran.liara.run/username?username=${payload.first_name}+${payload.last_name}`,
        provider: 'local',
      } as User;
      const user = fastify.usersRepository.insert(newUser);
      if (!user) {
        return reply.code(400).send({ message: 'user not created' }); //! what should do here?
      }
      const token = await fastify.generateConfirmToken(user.uid);
      const url = `${fastify.config.HOST}:${fastify.config.PORT}/auths/confirm?token=${token}`;
      await fastify.transporter.sendMail(confirmMailOptions(user.email, url)); // TODO we can use mail service for mailling
      return reply.code(201).send({ message: 'user created' });
    }
  );

  fastify.post(
    '/login',
    { schema: { body: LoginCredentials } },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { email, password } = request.body as LoginBody;
      if (request.cookies.accessToken) {
        try {
          await request.verifyAccessToken();
          return reply.conflict('already logged in');
        } catch (err: any) {
          return reply.unauthorized('refresh your session');
        }
      }
      const user = fastify.usersRepository.findByEmail(email);
      if (!user || !compare(password, user.password)) {
        return reply.unauthorized('wrong credentials');
      }
      if (!user.email_verified) {
        return reply.forbidden('email not verified yet');
      }
      const userMfa = fastify.mfaRepository.findByUserId(user.id);
      if (userMfa && userMfa.enabled) {
        request.session.pendingUser = {
          id: user.id,
          uid: user.uid,
          secret: userMfa.secret,
          pending: true,
        };
        return reply.send({ success: true, next: '/auth/verify-2fa' });
      }

      /**
    //TODO check if the user already online, if yes send notification and wait until user approve or deny
    //if (user.online) {
    //  notify user with suspecius login attempt
      //* use websocket to send notification
      //  if (user.deny || timeout) {
        //    block the new login and optionaly save ip and browser to let user know the logging in happen from where
      //  }
    //} else let them login normal and remove tokens from the logged user
 */

      const jti = randomUUID();
      const accessToken = await fastify.generateAccessToken(user.uid);
      const refreshToken = await fastify.generateRefreshToken(user.uid, jti);
      const now = Math.floor(Date.now() / 1000);
      fastify.usersRepository.update(user.id, {
        last_login: now,
        token_id: jti,
      });
      reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
      return reply.send({ success: true, next: '/dashboard' });
    }
  );

  fastify.get(
    '/confirm',
    { schema: { querystring: ConfirmToken } },
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const { sub } = await request.verifyConfirmToken();
        if (!sub) {
          return reply.badRequest('invalid token');
        }
        const user = fastify.usersRepository.findByUID(sub);
        if (!user) {
          return reply.badRequest('user not found');
        }
        if (user.email_verified) {
          return reply.conflict('already verified');
        }
        const jti = randomUUID();
        const accessToken = await fastify.generateAccessToken(user.uid);
        const refreshToken = await fastify.generateRefreshToken(user.uid, jti);
        fastify.usersRepository.update(user.id, {
          email_verified: 1,
          last_login: Math.floor(Date.now() / 1000),
          token_id: jti,
        });
        reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
      } catch (err: any) {
        return reply.forbidden('invalid token');
      }
      return reply.redirect('/auth/choose-username');
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
