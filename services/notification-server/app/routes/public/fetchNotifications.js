import onRequestHookHandler from "../../hooks/onRequestHook.js";

async function fetchNotificationHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    const result = this.notifications.get(user.id);
    reply.send(result);
}

async function fetchNotification(fastify, opt) {

    fastify.addHook('onRequest', onRequestHookHandler);

    fastify.route({
        url: '/fetch',
        method: 'GET',
        handler: fetchNotificationHandler,
    })
}

export default fetchNotification;