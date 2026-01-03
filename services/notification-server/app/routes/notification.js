import health from "./private/health.js";
import sendNotification from "./private/sendNotifications.js";
import fetchNotification from "./public/fetchNotifications.js";

async function notification(fastify) {

    fastify.decorate('notifications', new Map());

    fastify.register(sendNotification);
    fastify.register(fetchNotification);
    fastify.register(health);
}

export default notification;