import fp from "fastify-plugin";
import PongError from "../classes/PongError.js";

export default fp(async function errorHandler(fastify, options) {
    fastify.setErrorHandler((error, request, reply) => {
        console.log(error);
        if (error && (error instanceof PongError)) {
            reply.code(error.code).send(error.reason);
        } else {
            reply.code(503).send("Service Unavailable!!");
        }
    })
});