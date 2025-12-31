import { randomUUID } from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { decrypt, encrypt } from '../auth/security/cipher-util.js';
import { TwoFABody } from '../schemas/auth.js';

export default abstract class MFAController {
    static async setup(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const user = request.user;
        if (!user) {
            return reply.badRequest('user not found');
        }
        const secret = authenticator.generateSecret();
        const uri = authenticator.keyuri(user.email, 'PONG', secret);
        const qrcode = await QRCode.toDataURL(uri);
        const html = `<img src=${qrcode} />`;

        if (user.mfa_enabled) {
            return reply.forbidden('2fa already enabled');
        }

        this.usersRepository.update(user.id, {
            mfa_enabled: 0,
            mfa_secret: encrypt(secret),
        });
        
        return reply.send(html);
    }

    static async verify(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { code } = request.body as TwoFABody;
        try {
            const user = request.user;
            if (!user) {
                return reply.badRequest('user not found');
            }
            if (!user.mfa_secret) {
                return reply.badRequest('your not allowed to do this');
            }
            if (user.mfa_enabled) {
                return reply.badRequest('2fa already enabled');
            }
            const secret = decrypt(user.mfa_secret);
            const isValid = authenticator.verify({ token: code, secret });
            if (!isValid) {
                return reply.badRequest('invalid code');
            }
            this.usersRepository.update(user.id, { mfa_enabled: 1 });
            return reply.send({ success: true, message: '2fa enabled' });
        } catch (err: any) {
            return reply.send(err);
        }
    }

    static async disable(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { code } = request.body as TwoFABody;
        try {
            const user = request.user;
            if (!user) {
                return reply.badRequest('no user found with this uid');
            }
            const secret = decrypt(user.mfa_secret!);
            const isValid = authenticator.verify({ token: code, secret });
            if (!isValid) {
                return reply.badRequest('invalid code');
            }
            if (!user.mfa_enabled) {
                return reply.forbidden('2fa already disabled');
            }
            this.usersRepository.update(user.id, {
                mfa_enabled: 0,
                mfa_secret: null,
            });
            return reply.send({ success: true, message: '2fa disabled' });
        } catch (err: any) {
            return reply.badRequest();
        }
    }

    static async verifyLogin(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { code } = request.body as TwoFABody;
        try {
            const user = request.pendingUser;
            if (!user) {
                return reply.badRequest('login first');
            }
            if (!user.mfa_secret) {
                return reply.badRequest('2fa not enabled yet');
            }
            const secret = decrypt(user.mfa_secret);
            const isValid = authenticator.verify({ token: code, secret });
            if (!isValid) {
                return reply.badRequest('invalid code');
            }

            const jti = randomUUID();
            const accessToken = await this.generateAccessToken(user.uid);
            const refreshToken = await this.generateRefreshToken(user.uid, jti);
            const now = Math.floor(Date.now() / 1000);
            this.usersRepository.update(user.id, {
                last_login: now,
                token_id: jti,
                token_updated_at: now
            });
            reply
                .sendAccessToken(accessToken)
                .sendRefreshToken(refreshToken)
                .clearNonceToken();
            return reply.send({
                success: true,
                message: 'user logged in successfully',
                next: '/dashboard',
            });
        } catch (err: any) {
            return reply.badRequest();
        }
    }
}
