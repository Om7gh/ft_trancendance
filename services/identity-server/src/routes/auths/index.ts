import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import { randomUUID } from 'crypto';
import { compare, hash } from '../../auth/security/cipher-util.js';
import { User } from '../../models/user.js';
import mailOptions from '../../utils/mail-options.js';

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
    async function (request, reply) {
      const payload = request.body as RegisterBody;
      console.log('hello world');
      //!
      //! what if the user exist but an error occur int the database!
      const exists = fastify.usersRepository.findByEmail(payload.email);
      if (exists) {
        return reply.conflict('an account with this email already exists');
      }

      const newUser = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: hash(payload.password),
        username: payload.email.split('@')[0], //TODO check if username already exists and add random string to it if email different
        //? (e.g aaitelka@gmail.com, aaitelka@hotmail.com) first one take aaitelka,
        //? when second one signup aaitelka should be taken before and emails differents so should add random string to it
        avatar: `https://avatar.iran.liara.run/username?username=${payload.first_name}+${payload.last_name}`,
        token_id: '',
      } as User;

      //!
      //! what if the user not inserted correctly
      const user = fastify.usersRepository.insert(newUser);

      const token = await fastify.generateConfirmToken(user.uid);
      const url = `${fastify.config.HOST}:${fastify.config.PORT}/auths/confirm?token=${token}`;
      if (user) {
        await fastify.transporter.sendMail(mailOptions(user.email, url));
      }
      return reply
        .code(201)
        .send({ message: 'user created successfully', user: newUser });
    }
  );

  fastify.post(
    '/login',
    { schema: { body: LoginCredentials } },
    async function (request, reply) {
      const { email, password } = request.body as LoginBody;
      if (request.cookies.accessToken) {
        try {
          //? this happen when the user try to logging in from the same browser twice
          await request.verifyAccessToken();
          return reply.conflict('already logged in');
        } catch (err: any) {
          return reply.unauthorized('refresh your session'); //? front should redirect user to /refresh endpoint
        }
      }
      const user = fastify.usersRepository.findByEmail(email);
      if (!user || !compare(password, user.password)) {
        return reply.badRequest('wrong credentials');
      }
      if (!user.email_verified) {
        return reply.forbidden('email not verified yet'); //TODO in front should make user send new confirmation email
      }
      const userMfa = fastify.mfaRepository.findByUserId(user.id);
      if (userMfa?.enabled) {
        request.session.pendingUser = {
          id: user.id,
          uid: user.uid,
          secret: userMfa.secret,
          pending: true,
        };
        return reply.send({ success: true, next: '/auth/2-factor-activation' });
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
      // fastify.redis.set(jti, user.uid)
      reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
      return reply.send({ success: true, next: '/dashboard' }); //{ success: true, message: 'you can play PONG now' }
    }
  );

  fastify.get('/me', fastify.authenticate);

  fastify.get(
    '/confirm',
    { schema: { querystring: ConfirmToken } },
    async function (request, reply) {
      try {
        const { sub } = await request.verifyConfirmToken();
        if (!sub) {
          return reply.badRequest('invalid token');
        }
        const user = fastify.usersRepository.findByUID(sub);
        if (!user) {
          // redirect to login
          return reply.badRequest('user not found');
        }
        if (user.email_verified) {
          // redirect to dashboard
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
        // fastify.redis.set(jti, user.uid)
        reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
      } catch (err: any) {
        // redirect to resend link component
        return reply.forbidden('invalid token');
      }
      return reply.redirect('/auth/avatar');
    }
  );
  //TODO we need another endpoint for sending new confirmation email to users if email not sent
  //TODO and restrict it by time like one emial every 15min
};

export default plugin;
