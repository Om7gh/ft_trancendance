import errorHandler from "../plugins/errorHandler.js";
import Statistics from "../classes/statisticsClass.js";
import statisticsSchema from "../schemas/statisticsSchema.js";

async function pongStatisticsHandler(request, reply) {
    const uid  = request.query.uid;

    const matches = this.db.getMatchesByUser(uid);

    const statistics = new Statistics(matches, uid);

    this.log.info(statistics);

    reply.send(statistics);
}

export default async function pongStatistics(fastify, options) {

    fastify.register(errorHandler);

    fastify.route({
        url     : '/pong/statistics',
        method  : 'GET',
        schema  : statisticsSchema,
        handler : pongStatisticsHandler,
    })
}