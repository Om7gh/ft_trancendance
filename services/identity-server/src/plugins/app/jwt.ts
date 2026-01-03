import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { JWTPayload, jwtVerify } from 'jose';
import { PkceParams } from '../../auth/remote/types/pkce.js';
import generateToken from '../../jwt/jose.js';
import { User } from '../../models/user.js';

type PendingUser = {
    id: number;
    uid: string;
    username: string;
    mfa_secret: string;
};

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: typeof authenticate;
        trackPendingUser: typeof trackPendingUser;
        generateAccessToken: typeof generateAccessToken;
        generateRefreshToken: typeof generateRefreshToken;
        generateNonceToken: typeof generateNonceToken;
    }
    interface FastifyRequest {
        verifyAccessToken: typeof verifyAccessToken;
        verifyRefreshToken: typeof verifyRefreshToken;
        verifyNonceToken: typeof verifyNonceToken;
        verifyConfirmToken: typeof verifyConfirmToken;

        user: User;
        pkce: PkceParams;
        pendingUser: PendingUser;
    }
    interface FastifyReply {
        sendAccessToken: typeof sendAccessToken;
        clearAccessToken: typeof clearAccessToken;
        sendRefreshToken: typeof sendRefreshToken;
        clearRefreshToken: typeof clearRefreshToken;
        sendNonceToken: typeof sendNonceToken;
        clearNonceToken: typeof clearNonceToken;
    }
}

async function trackPendingUser(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        const { sub } = await request.verifyNonceToken();
        const user = this.usersRepository.findByUID(sub!);
        if (!user) {
            return reply.badRequest('no user found with this uid');
        }
        request.pendingUser = {
            id: user.id,
            uid: user.uid,
            username: user.username,
            mfa_secret: user.mfa_secret || '',
        };
    } catch (err: any) {
        return reply.unauthorized(err.message || 'Unauthorized');
    }
}

async function authenticate(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        const { sub } = await request.verifyAccessToken();
        const user = this.usersRepository.findByUID(sub!);
        if (!user) {
            return reply.badRequest('no user found with this uid');
        }
        request.user = user;
    } catch (err: any) {
        return reply.unauthorized(err.message || 'Unauthorized');
    }
}

async function generateAccessToken(
    this: FastifyInstance,
    uid: string
): Promise<string> {
    return await generateToken({
        sub: uid,
        secret: this.tokenSecrets.accessToken,
        expiresIn: '15m',
    });
}

function sendAccessToken(
    this: FastifyReply,
    accessToken: string
): FastifyReply {
    return this.setCookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
    });
}

async function verifyAccessToken(this: FastifyRequest): Promise<JWTPayload> {
    const token = this.cookies.accessToken;
    if (!token) {
        throw new Error('no access token provided!');
    }
    const { payload } = await jwtVerify(
        token,
        Buffer.from(this.server.tokenSecrets.accessToken)
    );
    return payload;
}

function clearAccessToken(this: FastifyReply): FastifyReply {
    return this.clearCookie('accessToken', { path: '/' });
}

async function generateRefreshToken(
    this: FastifyInstance,
    uid: string,
    jti: string
): Promise<string> {
    return await generateToken({
        sub: uid,
        jti: jti,
        secret: this.tokenSecrets.refreshToken,
        expiresIn: '30d',
    });
}

function sendRefreshToken(
    this: FastifyReply,
    refreshToken: string
): FastifyReply {
    return this.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 60 * 60 * 24 * 7 * 4 + 2,
    });
}

async function verifyRefreshToken(this: FastifyRequest): Promise<JWTPayload> {
    const token = this.cookies.refreshToken;
    if (!token) {
        throw new Error('no refresh token provided!');
    }
    const { payload } = await jwtVerify(
        token,
        Buffer.from(this.server.tokenSecrets.refreshToken)
    );
    return payload;
}

function clearRefreshToken(this: FastifyReply): FastifyReply {
    return this.clearCookie('refreshToken', { path: '/api/auth/refresh' });
}

async function generateNonceToken(
    this: FastifyInstance,
    uid: string,
    expiresIn: string
): Promise<string> {
    return await generateToken({
        sub: uid,
        secret: this.tokenSecrets.confirmToken,
        expiresIn: expiresIn,
    });
}

function sendNonceToken(this: FastifyReply, _tr_token: string): FastifyReply {
    return this.setCookie('_nonceToken', _tr_token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 5,
    });
}

async function verifyConfirmToken(this: FastifyRequest): Promise<JWTPayload> {
    const { token } = this.query as { token: string };
    if (!token) {
        throw new Error('no token provided!');
    }
    const { payload } = await jwtVerify(
        token,
        Buffer.from(this.server.tokenSecrets.confirmToken)
    );
    return payload;
}

async function verifyNonceToken(this: FastifyRequest): Promise<JWTPayload> {
    const token = this.cookies._nonceToken;
    if (!token) {
        throw new Error('no token provided!');
    }
    const { payload } = await jwtVerify(
        token,
        Buffer.from(this.server.tokenSecrets.confirmToken)
    );
    return payload;
}

function clearNonceToken(this: FastifyReply): FastifyReply {
    return this.clearCookie('_nonceToken', { path: '/' });
}

export default fp(
    async (fastify) => {
        fastify.decorate('authenticate', authenticate);
        fastify.decorate('trackPendingUser', trackPendingUser);
        fastify.decorate('generateAccessToken', generateAccessToken);
        fastify.decorate('generateRefreshToken', generateRefreshToken);
        fastify.decorate('generateNonceToken', generateNonceToken);
        fastify.decorateRequest('verifyAccessToken', verifyAccessToken);
        fastify.decorateRequest('verifyRefreshToken', verifyRefreshToken);
        fastify.decorateRequest('verifyNonceToken', verifyNonceToken);
        fastify.decorateRequest('verifyConfirmToken', verifyConfirmToken);
        fastify.decorateReply('sendAccessToken', sendAccessToken);
        fastify.decorateReply('clearAccessToken', clearAccessToken);
        fastify.decorateReply('sendRefreshToken', sendRefreshToken);
        fastify.decorateReply('clearRefreshToken', clearRefreshToken);
        fastify.decorateReply('sendNonceToken', sendNonceToken);
        fastify.decorateReply('clearNonceToken', clearNonceToken);
    },
    { name: 'jwt' }
);
