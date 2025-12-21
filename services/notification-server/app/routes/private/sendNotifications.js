import notificationSchema from "../../schemas/notificationSchema.js";

async function sendNotificationHandler(request, reply) {
    const notifications = request.body.data;

    if (notifications) {
        for (let item of notifications) {
            let receiver = item.receiver;
            if (receiver) {
                let pendingNotifications = this.notifications.get(receiver.id);

                if (pendingNotifications) {
                    pendingNotifications.push(item);
                } else {
                    this.notifications.set(receiver.id, notifications)
                }
                console.log(this.notifications.get(receiver.id));
            }
        }
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