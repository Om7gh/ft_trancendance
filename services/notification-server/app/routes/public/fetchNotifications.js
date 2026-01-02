import NotificationError from "../../classes/notificationError.js";
import onRequestHookHandler from "../../hooks/onRequestHook.js";

async function fetchNotificationHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        throw new NotificationError(400, "Pass Invalid User to handler!!");
    }

    const result = this.db.getNotificationsByUser(user.id);
    reply.send(result);
}

async function fetchNotification(fastify, opt) {

    fastify.register(onRequestHookHandler);

    fastify.route({
        url: '/fetch',
        method: 'GET',
        handler: fetchNotificationHandler,
    })
}

export default fetchNotification;
