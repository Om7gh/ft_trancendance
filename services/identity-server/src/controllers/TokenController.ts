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
        return reply.forbidden('you dont have access to this resources');
      }
      const newAccessToken = await this.generateAccessToken(payload.sub!);
      return reply.sendAccessToken(newAccessToken).send({ success: true });
    } catch (err) {
      reply.clearAccessToken().clearRefreshToken().clearCookie('sessionId');
      request.session.destroy();
      return reply.unauthorized('refresh token invalid');
    }
  }
}
