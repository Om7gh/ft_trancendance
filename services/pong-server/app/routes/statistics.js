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
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    const matches = this.db.getMatchesByUser(user.id);
    const statistics = new Statistics(matches, user.id);

    this.log.info(statistics);
    
    reply.send(statistics);
}

export default async function statistics(fastify, options) {

    fastify.route({
        url     : '/pongGame/statistics',
        method  : 'GET',
        handler : statisticsHandler,
    })
}