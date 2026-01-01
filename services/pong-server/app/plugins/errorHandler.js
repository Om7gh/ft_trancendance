import fp from "fastify-plugin";

export default fp(async function errorHandler(fastify, options) {
    fastify.setErrorHandler((error, request, reply) => {
        if (error && (error.type === "pongError"))
            reply.code(error.statusCode).send(error.message);
        else {
            console.log(error.message)
            reply.code(400).send();
        }
    })
});