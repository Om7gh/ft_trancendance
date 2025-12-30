import { randomUUID } from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Pkce } from '../auth/index.js';
import { PkceParams } from '../auth/remote/types/pkce.js';
import { compare, hash } from '../auth/security/cipher-util.js';
import asUser, { asUserInfo } from '../dto/user-dto.js';
import { User } from '../models/user.js';
import {
    LoginBody,
    OAuth2Body,
    OAuth2CallbackBody,
    RegisterBody,
    UsernameBody,
} from '../schemas/auth.js';
import saveAvatar, { saveUploadedAvatar } from '../utils/avatar-utils.js';
import { confirmMailOptions, magicLinkOptions } from '../utils/mail-options.js';

export default abstract class AuthController {
    private static async issueTokens(
        fastify: FastifyInstance,
        user: User
    ): Promise<[string, string]> {
        const jti = randomUUID();
        const now = Math.floor(Date.now() / 1000);
        const accessToken = await fastify.generateAccessToken(user.uid);
        const refreshToken = await fastify.generateRefreshToken(user.uid, jti);
        fastify.usersRepository.update(user.id, {
            last_login: now,
            token_id: jti,
        });
        return [accessToken, refreshToken];
    }

    static async redirect(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { provider } = request.params as OAuth2Body;
        if (!this.auth.isSupported(provider)) {
            throw this.httpErrors.notFound(
                `Provider '${provider}' is not supported`
            );
        }
        const pkce = Pkce.getParams();
        const pkceParams = `${pkce.state};${pkce.codeVerifier};${pkce.codeChallenge}`;
        reply.sendNonceToken(await this.generateNonceToken(pkceParams, '5m'));
        const url = this.auth.getAuthUrl(provider, pkce);
        reply.redirect(url);
    }

    static async oauth2Login(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { provider } = request.params as OAuth2Body;
        const { state, code, error } = request.query as OAuth2CallbackBody;
        if (error) {
            console.error(`OAuth error from ${provider}: ${error}`);
            const errorMsg = encodeURIComponent(
                'authentication failed: ' + (error || 'unknown error')
            );
            return reply.redirect(`/signin?error=${errorMsg}`);
        }
        if (!code || !state) {
            return reply.badRequest(error ?? 'missing code or state');
        }
        try {
            const { sub } = await request.verifyNonceToken();
            const [state, codeVerifier, codeChallenge] = sub!.split(';');
            if (state !== state) {
                throw this.httpErrors.badRequest('invalid state parameter');
            }
            const strategy = this.auth.use(provider);
            const pkce = { state, codeVerifier, codeChallenge } as PkceParams;
            const tokens = await strategy.getTokens(code, pkce);
            const payload = await strategy.getUserInfo(tokens);
            if (!payload || !payload.email) {
                throw reply.badRequest('email not found in OAuth payload');
            }
            const user = this.usersRepository.findOrCreate(
                asUser(provider, payload) as User
            );
            if (!user.username) {
                reply.sendNonceToken(
                    await this.generateNonceToken(user.uid, '5m')
                );
                return reply.redirect('/auth/complete-registration');
            }
            const [accessToken, refreshToken] =
                await AuthController.issueTokens(this, user);
            reply
                .sendAccessToken(accessToken)
                .sendRefreshToken(refreshToken)
                .clearNonceToken();
            return reply.redirect('/dashboard');
        } catch (err: any) {
            return reply.badRequest(err.message);
        }
    }

    static async signup(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const payload = request.body as RegisterBody;
        this.log.info(payload);
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
            return reply.code(400).send({ message: 'user not created' });
        }
        const token = await this.generateNonceToken(user.uid, '1h');
        const url = `${this.config.HOST}:${this.config.PORT}/api/auth/confirm?token=${token}`;
        await this.transporter.sendMail(confirmMailOptions(user.email, url));
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
            return reply.badRequest('wrong credentials');
        }
        if (!user.email_verified) {
            return reply.forbidden('email not verified yet');
        }
        if (!user.username) {
            return reply
                .sendNonceToken(await this.generateNonceToken(user.uid, '5m'))
                .send({
                    success: true,
                    message: 'username not set',
                    next: '/auth/complete-registration',
                });
        }
        const userMfa = this.mfaRepository.findByUserId(user.id);
        if (userMfa && userMfa.enabled) {
            reply.sendNonceToken(await this.generateNonceToken(user.uid, '5m'));
            return reply.send({ success: true, next: '/auth/verify-2fa' });
        }

        const _30d = user.token_updated_at + 30 * 24 * 60 * 60;
        const expired = Math.floor(Date.now() / 1000) > _30d;
        if (!expired) {
            try {
                const allowed = this.usersRepository.touchLoginRateLimit(
                    user.id
                );

                if (!allowed) {
                    return reply.tooManyRequests(
                        'Please wait before requesting another login email.'
                    );
                }
                const token = await this.generateNonceToken(user.uid, '1h');
                const url = `${this.config.HOST}:${this.config.PORT}/api/auth/auto-login?token=${token}`;
                await this.transporter.sendMail(
                    magicLinkOptions(user.email, url)
                );
                return reply.badRequest(
                    'You already logged in on another device, we sent you an email to revoke old sessions before you make new logging'
                );
            } catch (err: any) {
                return reply.badRequest(err.message);
            }
        }

        const [accessToken, refreshToken] = await AuthController.issueTokens(
            this,
            user
        );
        reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
        return reply.send({ success: true, next: '/dashboard' });
    }

    static async logout(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const last_logout = Math.floor(Date.now() / 1000);

        this.usersRepository.update(request.user.id, {
            last_logout,
            token_id: '',
            token_updated_at: 0,
        });
        return reply.clearAccessToken().send({ success: true });
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
            this.usersRepository.update(user.id, { email_verified: 1 });
            reply.sendNonceToken(await this.generateNonceToken(user.uid, '5m'));
            return reply.redirect('/auth/complete-registration');
        } catch (err: any) {
            return reply.forbidden('invalid-token');
        }
    }

    static async autoLogin(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { sub } = await request.verifyConfirmToken();
            if (!sub) {
                return reply.badRequest('invalid magic link token');
            }
            const user = this.usersRepository.findByUID(sub);
            if (!user) {
                return reply.badRequest('user not found');
            }
            const [accessToken, refreshToken] =
                await AuthController.issueTokens(this, user);
            reply.sendAccessToken(accessToken).sendRefreshToken(refreshToken);
            return reply.send({ success: true, next: '/dashboard' });
        } catch (err: any) {
            if (err.message === 'TOKEN_RATE_LIMITED') {
                return reply.tooManyRequests(
                    'Magic link already used. Try again in 1 hour.'
                );
            }
            return reply.forbidden('invalid-magic-token');
        }
    }

    private static async validateUsername(
        fastify: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply,
        username: string
    ) {
        try {
            const user = request.pendingUser;
            if (!user) {
                return reply.forbidden('user not found');
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
        } catch (err: any) {
            return reply.badRequest(err.message);
        }
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
            request.pendingUser = { ...user, username };

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
        let bio: string | undefined;
        let avatar: string | undefined;

        try {
            const user = this.usersRepository.findById(request.pendingUser.id);
            if (!user) {
                return reply.badRequest('no user found');
            }
            for await (const part of request.parts()) {
                if (part.type === 'file' && part.fieldname === 'avatar') {
                    avatar = await saveUploadedAvatar(
                        user.uid,
                        user.username,
                        part
                    );
                }

                if (part.type === 'field' && part.fieldname === 'bio') {
                    bio = String(part.value);
                }
            }
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

            const [accessToken, refreshToken] =
                await AuthController.issueTokens(this, user);

            reply
                .sendAccessToken(accessToken)
                .sendRefreshToken(refreshToken)
                .clearNonceToken()
                .send({ success: true });
        } catch (err) {
            request.log.error(err);
            return reply.notFound('complete-profile failed');
        }
    }

    static async userInfo(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        let userInfo = asUserInfo(request.user);
        const userMfa = this.mfaRepository.findById(request.user.id);
        if (userMfa) {
            userInfo = {
                ...userInfo,
                mfa_enabled: userMfa.enabled ? true : false,
            };
        }
        return reply.send(userInfo);
    }
}
