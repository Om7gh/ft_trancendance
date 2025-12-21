import notificationSchema from "../../schemas/notificationSchema.js";

async function sendNotificationHandler(request, reply) {
    const notification          = request.body;
    const receiver              = notification.receiver;
    const pendingNotifications  = this.notifications.get(receiver.uid);

    if (pendingNotifications) {
        pendingNotifications.push(notification);
    } else {
        this.notifications.set(receiver.uid, [notification,])
    }

    return ("Notifiaction queued successfully.");
}

async function sendNotification(fastify, opt) {

    fastify.route({
        url: '/send',
        method: 'post',
        schema: notificationSchema,
        handler: sendNotificationHandler,
    })
}

export default sendNotification;