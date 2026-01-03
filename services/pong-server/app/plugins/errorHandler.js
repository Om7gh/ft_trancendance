import fp from "fastify-plugin";
import PongError from "../classes/PongError.js";

export default fp(async function errorHandler(fastify, options) {
    fastify.setErrorHandler((error, request, reply) => {
        console.log(error);
        reply.code(error.code).send(error.reason);
    //     if (error && (error instanceof PongError)) {
    // } else {
    //     reply.code(400).send("Unexpected Error!!");
    //         console.log(error.message)
    //     }
    })
});