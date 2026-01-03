import sendNotification from "./private/sendNotifications.js";
import fetchNotification from "./public/fetchNotifications.js";
import health from "./public/health.js";

async function notification(fastify, opt) {

    fastify.decorate('notifications', new Map());

    fastify.register(sendNotification);
    fastify.register(fetchNotification);
    fastify.register(health);
}

export default notification;