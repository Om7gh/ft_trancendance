import fp from "fastify-plugin";
import { PongError } from "../routes/pongClasses.js";

export default fp(async function errorHandler(fastify, options) {
    fastify.setErrorHandler((error, request, reply) => {
        if (error && (typeof(error) === PongError)) {
            reply.send(error.toJSON());
        } else {
            console.log(error);
            reply.code(error.statusCode).send({reason: "Unexpected Error", errorCode: "E000"});
        }
    })
});