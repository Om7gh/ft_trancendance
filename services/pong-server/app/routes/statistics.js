import errorHandler from "../plugins/errorHandler.js";
import Statistics from "../classes/statisticsClass.js";
import statisticsSchema from "../schemas/statisticsSchema.js";

async function statisticsHandler(request, reply) {
    const uid  = request.query.uid;
    
    try {
        var matches = this.db.getMatchesByUser(uid);
        var statistics = new Statistics(matches, uid);
    } catch (err) {
        throw new PongError(503, "Error statistics fetching!!");
    }

    reply.send(statistics);
}

export default async function statistics(fastify) {

    fastify.register(errorHandler);

    fastify.route({
        url     : '/statistics',
        method  : 'GET',
        schema  : statisticsSchema,
        handler : statisticsHandler,
    })
}