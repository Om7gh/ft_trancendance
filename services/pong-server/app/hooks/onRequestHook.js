import fp from 'fastify-plugin';

export default fp(async function onRequestHook(fastify, options) {

    fastify.addHook('onRequest', async function(request, reply) {
        try {
            const cookie = request.headers.cookie;
            
            if (!cookie) {
                reply.code(401).send();        
                return ;
            }
            const response = await this.axios.get("http://identity:4000/auths/userinfo", {
                headers: {
                    Cookie: cookie,
                }
            });
            request.user = await response.data;
        } catch (err) {
            reply.code(401).send("Refresh your access token");
        }
    });
    
});
