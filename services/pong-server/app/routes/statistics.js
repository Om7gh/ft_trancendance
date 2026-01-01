import errorHandler from "../plugins/errorHandler.js";
import Statistics from "../classes/statisticsClass.js";
import statisticsSchema from "../schemas/statisticsSchema.js";

async function statisticsHandler(request, reply) {
    const uid  = request.query.uid;
    const matches = this.db.getMatchesByUser(uid);
    const statistics = new Statistics(matches, uid)

    reply.send(statistics);
}

export default async function statistics(fastify, options) {

    fastify.register(errorHandler);

    fastify.route({
        url     : '/statistics',
        method  : 'GET',
        schema  : statisticsSchema,
        handler : statisticsHandler,
    })
}