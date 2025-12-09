import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { randomUUID } from 'crypto';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { decrypt, encrypt } from '../../../auth/security/cipher-util.js';

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
    async function setup2FA(request, reply) {
      const user = request.session.user; //? this setted from authenticate function

      const secret = authenticator.generateSecret();
      const uri = authenticator.keyuri(user.email, 'PONG', secret);
      const qrcode = await QRCode.toDataURL(uri);
      const html = `<img src=${qrcode} />`;

      const mfa = fastify.mfaRepository.findByUserId(user.id);
      if (!mfa) {
        fastify.mfaRepository.create({
          user_id: user.id,
          secret: encrypt(secret),
          enabled: 0,
        });
      }

      if (mfa?.enabled) {
        return reply.forbidden('2fa already enabled');
      }
      //TODO IMPORTANT, Handle if user dosent scan qr, make them generate new one or save the generated qr to sned it again
      return reply.send(html);
    }
  );

  fastify.post(
    '/verify',
    { onRequest: [fastify.authenticate] },
    async function setup2FA(request, reply) {
      const { code } = request.body as { code: string };
      try {
        const user = request.session.user;
        const user2FA = fastify.mfaRepository.findByUserId(user.id);
        if (!user2FA) {
          return reply.unauthorized('your not allowed to do this');
        }
        if (user2FA.enabled) {
          return reply.forbidden('2fa already enabled');
        }
        const secret = decrypt(user2FA.secret);
        const token = authenticator.generate(secret);
        const isValid = authenticator.verify({ token, secret });
        if (!isValid || token != code) {
          return reply.badRequest('invalid code');
        }
        fastify.mfaRepository.update(user.id, { enabled: 1 });
        return reply.send({ success: true, message: '2fa enabled' });
      } catch (err: any) {
        return reply.send(err);
      }
    }
  );

  fastify.post('/verify-login', async function setup2FA(request, reply) {
    const { code } = request.body as { code: string };
    const token = request.cookies.accessToken;
    if (token) {
      try {
        await request.verifyAccessToken();
        return reply.send({
          message: 'user already logged in',
          next: '/dashboard',
        }); // ? already logged in and access token valid
      } catch (err: any) {
        return reply.unauthorized('already logged refresh your token');
      }
    }
    try {
      const user = request.session.pendingUser; //? <-- this setted on /login
      if (!user) {
        return reply.badRequest('login first');
      }
      if (!user.pending) {
        return reply.badRequest('already logged in');
      }
      const secret = decrypt(user.secret);
      const token = authenticator.generate(secret);
      const isValid = authenticator.verify({ token, secret });
      if (!isValid || token != code) {
        return reply.unauthorized('invalid code');
      }

      const jti = randomUUID();
      const accessToken = await fastify.generateAccessToken(user.uid);
      const refreshToken = await fastify.generateRefreshToken(user.uid, jti);
      const now = Math.floor(Date.now() / 1000);
      fastify.usersRepository.update(user.id, {
        last_login: now,
        token_id: jti,
      });
      reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
      return reply.send({
        success: true,
        message: 'user logged in successfully',
        next: '/dashboard',
      });
    } catch (err: any) {
      return reply.code(401).send({
        success: false,
        message: err.message || 'error',
        next: null,
      });
    }
  });

  fastify.post(
    '/disable',
    { onRequest: [fastify.authenticate] },
    async function setup2FA(request, reply) {
      const { code } = request.body as { code: string };
      try {
        const user = request.session.user;
        const user2fa = fastify.mfaRepository.findByUserId(user.id);
        if (!user2fa) {
          return reply.badRequest('you dont have permission for this');
        }
        const secret = decrypt(user2fa.secret);
        const token = authenticator.generate(secret);
        const isValid = authenticator.verify({ token, secret });
        if (!isValid || token != code) {
          return reply.badRequest('invalid code');
        }
        if (!user2fa.enabled) {
          return reply.forbidden('2fa already disabled');
        }
        fastify.mfaRepository.delete(user.id);
        return reply.send({
          success: true,
          message: '2fa disabled',
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
