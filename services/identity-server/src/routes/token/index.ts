import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const token = request.cookies.refreshToken;
    if (!token) {
      // TODO user should redirect to loging
      reply.clearAccessToken();
      return reply.unauthorized('loggin first');
    }
    try {
      const payload = await request.verifyRefreshToken();
      const user = fastify.usersRepository.findByUID(payload.sub!);
      if (payload.jti != user?.token_id) {
        // TODO redirect user to loging
        return reply
          .clearAccessToken()
          .clearRefreshToken()
          .forbidden('refresh token rotated');
      }
      if (!user) {
        return reply.forbidden('you dont have access to this resources');
      }
      const newAccessToken = await fastify.generateAccessToken(payload.sub!);
      return reply.sendAccessToken(newAccessToken).send({ success: true });
    } catch (err) {
      // TODO redirect user to loging
      return reply.unauthorized('refresh token invalid');
    }
  });
};

export default plugin;
