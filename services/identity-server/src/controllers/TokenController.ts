import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default abstract class TokenController {
    static async generate(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const token = request.cookies.refreshToken;
        if (!token) {
            reply.clearAccessToken();
            return reply.unauthorized('loggin first');
        }
        try {
            const payload = await request.verifyRefreshToken();
            const user = this.usersRepository.findByUID(payload.sub!);
            if (payload.jti != user?.token_id) {
                return reply
                    .clearAccessToken()
                    .clearRefreshToken()
                    .forbidden('refresh token rotated');
            }
            if (!user) {
                return reply.forbidden(
                    'you dont have access to this resources'
                );
            }
            const newAccessToken = await this.generateAccessToken(payload.sub!);
            return reply
                .sendAccessToken(newAccessToken)
                .send({ success: true });
        } catch (err) {
            reply.clearAccessToken().clearRefreshToken();
            return reply.unauthorized('refresh token invalid');
        }
    }

    static async verifyToken(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { sub } = await request.verifyConfirmToken();
            const user = this.usersRepository.findByEmail(sub!);
            if (!user) {
                return reply.badRequest('no user found');
            }
            reply.sendNonceToken(await this.generateNonceToken(user.uid, '5m'));
            return reply.send({ success: true });
        } catch (err: any) {
            return reply.unauthorized(err.message);
        }
    }

    static async revoke(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const refreshToken = request.cookies.refreshToken;

        if (refreshToken) {
            try {
                const payload = await request.verifyRefreshToken();
                const user = this.usersRepository.findByUID(payload.sub!);
                if (!user) {
                    return reply.badRequest();
                }
                this.usersRepository.update(user.id, {
                    token_id: null,
                });
                console.log(`Token revoked for user ${payload.sub}`);
            } catch (err) {
                console.error('Error revoking token:', err);
            }
        }
        return reply.clearRefreshToken().send({ success: true });
    }
}
