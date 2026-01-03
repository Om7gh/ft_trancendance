import fp from 'fastify-plugin';
import PongError from '../classes/PongError.js';

export default fp(async function onRequestHook(fastify) {

    fastify.addHook('onRequest', async function(request, reply) {
        try {
            const cookie = request.headers.cookie;
            if (!cookie) {
                throw new PongError(400, "Bad Request!!");
            }
            const response = await this.axios.get("http://identity:4000/auth/userinfo", {
                headers: {
                    Cookie: cookie,
                }
            });
            request.user = await response.data;
        } catch (err) {
            if (err instanceof PongError) {    
                throw err
            }
            throw new PongError(401, "Unauthorized!!");
        }
    });
});
