import NotificationError from "../../classes/notificationError.js";
import notificationSchema from "../../schemas/notificationSchema.js";

async function sendNotificationHandler(request, reply) {
    const notifications = request.body.data;

    try {
        if (notifications) {
            for (let notification of notifications) {
                if (notification) {
                    let receiver = notification.receiver;
                    if (receiver && receiver.id) {
                        this.db.addNotification(notification);
                    }
                }
            }
        }
    } catch (err) {
        throw new NotificationError(503, "Error during the notification sending!!")
    }
    return ("Notifiaction queued successfully.");
}

async function sendNotification(fastify, opt) {
    fastify.route({
        url: '/send',
        method: 'POST',
        schema: notificationSchema,
        handler: sendNotificationHandler,
    })
}

export default sendNotification;