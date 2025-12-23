import fp from "fastify-plugin";

export default fp(async function errorHandler(fastify, options) {
    fastify.setErrorHandler((error, request, reply) => {
        if (error.statusCode && (error.statusCode < 500))
            reply.code(error.statusCode).send(error.message);
        else {
            reply.code(500).send("Unexpected error!!");
        }
    })
});
