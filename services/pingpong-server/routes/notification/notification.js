function httpHandler(request, reply) {
    const uid       = request.query.q;
    const result    = this.notifications.get(uid);

    if (result) {
        reply.send(JSON.stringify(result));
        this.notifications.delete(uid);
    } else
        reply.send(JSON.stringify([]));

    console.log("from notification: ", this.notifications);
}

export function notification(fastify, options, done) {

    fastify.route({
        url: '/notification',
        method: 'GET',
        handler: httpHandler,
    })

    done();
}