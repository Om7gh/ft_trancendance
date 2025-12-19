import fp from 'fastify-plugin';

export default fp(async function onRequesPlugin(fastify, options) {

    fastify.addHook('onRequest', async function(request, reply) {
        const cookie = request.headers.cookie;

        if (!cookie) {
            reply.code(401).send();        
            return ;
        }
    
        try {

            const response = await this.axios.get("http://identity:4000/auths/userinfo", {
                headers: {
                    Cookie: cookie,
                }
            });
            
            request.user = await response.data;
        } catch (err) {
            throw fastify.httpErrors.unauthorized('TOKEN_EXPIRED');

        }
    });
    
});
