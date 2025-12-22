import notificationSchema from "../../schemas/notificationSchema.js";

async function sendNotificationHandler(request, reply) {
    const notifications = request.body.data;

    if (notifications) {
        for (let item of notifications) {
            let receiver = item.receiver;
            if (receiver) {
                this.db.addNotification(item);
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