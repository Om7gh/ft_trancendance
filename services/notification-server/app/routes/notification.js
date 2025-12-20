import sendNotification from "./private/sendNotifications.js";
import fetchNotification from "./public/fetchNotifications.js";

async function notification(fastify, opt) {

    fastify.decorate('notifications', new Map());

    fastify.register(sendNotification);
    fastify.register(fetchNotification);
}

export default notification;