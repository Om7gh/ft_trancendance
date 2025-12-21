import fp from "fastify-plugin";

export default fp(async function errorHandler(fastify, options) {
    fastify.setErrorHandler((error, request, reply) => {
        console.log("error handler ----> ", error)
        if (error.statusCode && error.statusCode < 500)
            reply.code(error.statusCode).send(error.message);
        else
            reply.code(400).send("Unexpected error!!");
    })
});
