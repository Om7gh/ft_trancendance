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
        // const { sub } = await request.verifyAccessToken();
        const user = request.user; //this.usersRepository.findByUID(sub!);
        if (!user) {
            return reply.badRequest('user not found');
        }
        const secret = authenticator.generateSecret();
        const uri = authenticator.keyuri(user.email, 'PONG', secret);
        const qrcode = await QRCode.toDataURL(uri);
        const html = `<img src=${qrcode} />`;

        const mfa = this.mfaRepository.findByUserId(user.id);
        if (!mfa) {
            this.mfaRepository.create({
                user_id: user.id,
                secret: encrypt(secret),
                enabled: 0,
            });
        }

        if (mfa?.enabled) {
            return reply.forbidden('2fa already enabled');
        }
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
            const user2FA = this.mfaRepository.findByUserId(user.id);
            if (!user2FA) {
                return reply.unauthorized('your not allowed to do this');
            }
            if (user2FA.enabled) {
                return reply.forbidden('2fa already enabled');
            }
            const secret = decrypt(user2FA.secret);
            const isValid = authenticator.verify({ token: code, secret });
            if (!isValid) {
                return reply.badRequest('invalid code');
            }
            this.mfaRepository.update(user.id, { enabled: 1 });
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
            const user2fa = this.mfaRepository.findByUserId(user.id);
            if (!user2fa) {
                return reply.badRequest('you dont have permission for this');
            }
            const secret = decrypt(user2fa.secret);
            const isValid = authenticator.verify({ token: code, secret });
            if (!isValid) {
                return reply.badRequest('invalid code');
            }
            if (!user2fa.enabled) {
                return reply.forbidden('2fa already disabled');
            }
            this.mfaRepository.delete(user.id);
            return reply.send({
                success: true,
                message: '2fa disabled',
                next: null,
            });
        } catch (err: any) {
            return reply.unauthorized('unauthorized');
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
            const userMfa = this.mfaRepository.findByUserId(user.id);
            if (!userMfa) {
                return reply.badRequest('2fa not enabled for this user');
            }
            const secret = decrypt(userMfa.secret);
            const currentCode = authenticator.generate(secret);
            const isValid = authenticator.verify({
                token: currentCode,
                secret,
            });
            if (!isValid || currentCode != code) {
                return reply.unauthorized('invalid code');
            }

            const jti = randomUUID();
            const accessToken = await this.generateAccessToken(user.uid);
            const refreshToken = await this.generateRefreshToken(user.uid, jti);
            const now = Math.floor(Date.now() / 1000);
            this.usersRepository.update(user.id, {
                last_login: now,
                token_id: jti,
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
            return reply.unauthorized('unauthorized');
        }
    }
}
