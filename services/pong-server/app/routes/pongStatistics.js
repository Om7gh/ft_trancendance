import errorHandler from "../plugins/errorHandler.js";
import Statistics from "../classes/statisticsClass.js";
import statisticsSchema from "../schemas/statisticsSchema.js";

async function pongStatisticsHandler(request, reply) {
    const user = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    const matches = this.db.getMatchesByUser.get(user.id);

    const statistics = new Statistics(matches, user.id);

    this.log.info(statistics);

    reply.send(statistics);
}

export default async function pongStatistics(fastify) {

    fastify.register(errorHandler);

    fastify.route({
        url     : '/pong/statistics',
        method  : 'GET',
        schema  : statisticsSchema,
        handler : pongStatisticsHandler,
    })
}