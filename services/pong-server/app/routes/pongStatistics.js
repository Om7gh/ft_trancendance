import Statistics from "../classes/statisticsClass.js";

async function pongStatisticsHandler(request, reply) {
    const user = request.user;
    const state = this.validateUser(user);

    if (!state) {
        throw new PongError(400, "Invalid User Passed To Handler!!");
    }

    const matches = this.db.getMatchesByUser(user.id);

    const statistics = new Statistics(matches, user.id);

    reply.send(statistics);
}

export default async function pongStatistics(fastify) {

    fastify.route({
        url     : '/pongGame/statistics',
        method  : 'GET',
        handler : pongStatisticsHandler,
    })
}