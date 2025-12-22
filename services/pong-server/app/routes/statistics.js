import errorHandler from "../plugins/errorHandler.js";

class Statistics {
    constructor(matches, uid) {
        this.matches =  matches;
        this.wins = 0;
        this.loses = 0;

        for (let matche of this.matches) {
            if (matche.winner === uid)
                this.wins += 1;
            else
                this.loses += 1;
        }
    }

    toJson() {
        return ({
            wins: this.wins,
            loses: this.loses,
            matches: this.matches,
        })
    }
}

async function statisticsHandler(request, reply) {
    const uid  = request.query.uid;

    const matches = this.db.getMatchesByUser(uid);
    const statistics = new Statistics(matches, uid);

    this.log.info(statistics);

    reply.send(statistics);
}

export default async function statistics(fastify, options) {

    fastify.register(errorHandler);

    fastify.route({
        url     : '/statistics',
        method  : 'GET',
        handler : statisticsHandler,
    })
}