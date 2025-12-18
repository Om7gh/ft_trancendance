import { randomUUID } from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { compare, hash } from '../auth/security/cipher-util.js';
import { asUserInfo } from '../dto/user-dto.js';
import { User } from '../models/user.js';
import { LoginBody, RegisterBody, UsernameBody } from '../schemas/auth.js';
import saveAvatar from '../utils/avatar-utils.js';
import { confirmMailOptions } from '../utils/mail-options.js';

export default abstract class AuthController {
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
      return reply.clearAccessToken().clearRefreshToken();
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
      return reply.redirect('/auth/complete-registration');
    } catch (err: any) {
      return reply.forbidden('invalid-token');
    }
  }

  private static async validateUsername(
    fastify: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply,
    username: string
  ) {
    const pendingUser = request.session.pendingUser;
    if (!pendingUser) {
      reply.badRequest('no pending authentication');
      return null;
    }

    const user = fastify.usersRepository.findById(pendingUser.id);
    if (!user) {
      reply.forbidden('user not found');
      return null;
    }

    if (user.username) {
      reply.forbidden('username already set');
      return null;
    }

    const isTaken = fastify.usersRepository.findByUsername(username);
    if (isTaken) {
      reply.conflict('username is taken');
      return null;
    }

    return user;
  }

  static async checkUsername(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { username } = request.body as UsernameBody;

      const user = await AuthController.validateUsername(
        this,
        request,
        reply,
        username
      );
      if (!user) return;

      return reply.send({ success: true });
    } catch (err: any) {
      return reply.badRequest(`check-username: ${err.message}`);
    }
  }

  static async setUsername(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { username } = request.body as UsernameBody;

      const user = await AuthController.validateUsername(
        this,
        request,
        reply,
        username
      );
      if (!user) return;

      this.usersRepository.update(user.id, { username });
      request.session.user = { ...user, username };

      return reply.send({ success: true });
    } catch (err: any) {
      return reply.badRequest(`set-username: ${err.message}`);
    }
  }

  static async completeProfile(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    let { avatar, bio } = request.body as {
      avatar: string | undefined | null;
      bio: string;
    };
    if (!request.session.pendingUser) {
      return reply.badRequest('no pending authentication');
    }
    try {
      const user = request.session.user;
      if (!avatar) {
        avatar = await saveAvatar(
          user.uid,
          `${user.first_name.at(0)}${user.last_name.at(0)}`,
          `${user.username}.svg`
        );
      }
      this.usersRepository.update(user.id, {
        avatar,
        bio,
      });
      this.usersRepository.update(user.id, { avatar, bio });
      const jti = randomUUID();
      const accessToken = await this.generateAccessToken(user.uid);
      const refreshToken = await this.generateRefreshToken(user.uid, jti);
      const now = Math.floor(Date.now() / 1000);
      this.usersRepository.update(user.id, {
        last_login: now,
        token_id: jti,
      });
      reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.badRequest('complete-profile: error ' + err.message);
    }
  }

  static async userInfo(request: FastifyRequest, reply: FastifyReply) {
    const userInfo = asUserInfo(request.session.user);
    return reply.send(userInfo);
  }
}
