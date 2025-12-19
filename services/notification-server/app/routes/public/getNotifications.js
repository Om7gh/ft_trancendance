async function notificationPublicApiHandler(request, reply) {
    const uid       = request.user.id;
    const result    = this.notifications.get(uid);

    if (result) {
        reply.send(result);
        this.notifications.delete(uid);
    } else {
        reply.send([]);
    }
}

async function onRequestHookHandler(request, reply) {
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
        
        if (response.status !== 200) {
            reply.code(401).send();
            return ;
        }
        
        request.user = await response.data;
    } catch (err) {
        reply.code(401).send();
    }
}

function notificationPubilcApi(fastify, opt, done) {

    fastify.decorate('notifications', new Map());

    fastify.addHook('onRequest', onRequestHookHandler);

    fastify.route({
        url: '/notification/fetch',
        method: 'GET',
        handler: notificationPublicApiHandler,
    })

    done();
}

export default notificationPubilcApi;