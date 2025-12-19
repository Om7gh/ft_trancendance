async function notificationHandler(request, reply) {
    const uid       = request.user.id;
    const result    = this.notifications.get(uid);

    if (result) {
        reply.send(result);
        this.notifications.delete(uid);
    } else {
        reply.send([]);
    }
}

function notificationPrivateApi(fastify, opt, done) {

    fastify.decorate('notifications', new Map());

    fastify.addHook('onRequest', onRequestHookHandler);

    fastify.route({
        url: '/notifications/send',
        method: 'post',
        handler: notificationHandler,
    })

    done();
}

export default notificationPrivateApi;