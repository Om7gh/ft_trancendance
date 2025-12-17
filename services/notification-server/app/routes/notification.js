function notificationHandler(request, reply) {
    const uid = request.user.id;
    const result = this.notifications.get(uid);

    if (result)
        reply.send(result);
    else
        reply.send([]);

    this.notifications.delete(uid);
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

function notification(fastify, opt, done) {

    fastify.decorate('notifications', new Map());

    fastify.addHook('onRequest', onRequestHookHandler);

    fastify.route({
        url: '/notification',
        method: 'GET',
        handler: notificationHandler,
    })

    done();
}

export default notification;