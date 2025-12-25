import fp from 'fastify-plugin';

export default fp(async function onRequestHook(fastify, options) {

    fastify.addHook('onRequest', async function(request, reply) {
        try {
            const cookie = request.headers.cookie;
            
            if (!cookie) 
                throw new Error("No cookie");
            const response = await this.axios.get("http://identity:4000/auths/userinfo", {
                headers: {
                    Cookie: cookie,
                }
            });
            request.user = await response.data;
        } catch (err) {
            reply.code(401)
            reply.send((err.message !== "No cookie")
                ? "Refresh your access token"
                : err.message
            );
            return reply;
        }
    });
    
});
