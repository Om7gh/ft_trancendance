import { Static, Type } from '@fastify/type-provider-typebox';
import { randomUUID } from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { compare, hash } from '../auth/security/cipher-util.js';
import { User } from '../models/user.js';
import { confirmMailOptions } from '../utils/mail-options.js';

const LoginCredentials = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

type LoginBody = Static<typeof LoginCredentials>;

// const ConfirmToken = Type.Object({
//   token: Type.String(),
// });

const RegisterCredentials = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  first_name: Type.String(),
  last_name: Type.Optional(Type.String()),
});

type RegisterBody = Static<typeof RegisterCredentials>;

export default class AuthController {
  static async signup(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const payload = request.body as RegisterBody;
    const exists = this.usersRepository.findByEmail(payload.email);
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
    } as unknown as User;
    const user = this.usersRepository.insert(newUser);
    if (!user) {
      return reply.code(400).send({ message: 'user not created' }); //! what should do here?
    }
    const token = await this.generateConfirmToken(user.uid);
    const url = `${this.config.HOST}:${this.config.PORT}/auths/confirm?token=${token}`;
    await this.transporter.sendMail(confirmMailOptions(user.email, url)); // TODO we can use mail service for mailling
    return reply.code(201).send({ message: 'user created' });
  }

  static async login(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { email, password } = request.body as LoginBody;
    if (request.cookies.accessToken) {
      try {
        await request.verifyAccessToken();
        return reply.conflict('already logged in');
      } catch (err: any) {
        return reply.unauthorized('refresh your session');
      }
    }
    const user = this.usersRepository.findByEmail(email);
    if (!user || !compare(password, user.password)) {
      return reply.unauthorized('wrong credentials');
    }
    if (!user.email_verified) {
      return reply.forbidden('email not verified yet');
    }
    if (!user.username) {
      return reply.send({
        success: true,
        message: 'username not set',
        next: '/auth/complete-registration',
      });
    }
    const userMfa = this.mfaRepository.findByUserId(user.id);
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
    const accessToken = await this.generateAccessToken(user.uid);
    const refreshToken = await this.generateRefreshToken(user.uid, jti);
    const now = Math.floor(Date.now() / 1000);
    this.usersRepository.update(user.id, {
      last_login: now,
      token_id: jti,
    });
    reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
    return reply.send({ success: true, next: '/dashboard' });
  }

  static async logout(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const token = request.cookies.refreshToken;
    if (!token) {
      return reply.badRequest('already logged out');
    }
    try {
      const payload = await request.verifyRefreshToken();
      const user = this.usersRepository.findByUID(payload.sub!);
      if (!user) {
        return reply.badRequest('user not found');
      }
      this.usersRepository.update(user.id, {
        token_id: 'user-logged-out',
      });
      reply.clearAccessToken().clearRefreshToken();
    } catch (err: any) {
      return reply.badRequest(err);
    }
  }

  static async confirmEmail(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { sub } = await request.verifyConfirmToken();
      if (!sub) {
        return reply.badRequest('invalid confirm token');
      }
      const user = this.usersRepository.findByUID(sub);
      if (!user) {
        return reply.badRequest('user not found');
      }
      if (user.email_verified) {
        return reply.conflict('already verified');
      }
      request.session.pendingUser = {
        id: user.id,
        uid: user.uid,
        secret: '',
        pending: true,
      };
      this.usersRepository.update(user.id, { email_verified: 1 });
    } catch (err: any) {
      return reply.forbidden('invalid-token');
    }
    return reply.redirect('/auth/complete-registration');
  }
}
