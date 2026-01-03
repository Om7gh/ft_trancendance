import fp from "fastify-plugin";

export default fp(async function errorHandler(fastify, options) {
    fastify.setErrorHandler((error, request, reply) => {
        if (error && (error instanceof NotificationError)) {
            reply.code(error.code).send(error.reason);
        } else {
            reply.code(400).send("Unexpected Error!!");
            console.log(error.message)
        }
    })
});
