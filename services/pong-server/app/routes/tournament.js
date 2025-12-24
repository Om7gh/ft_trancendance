export function alreadyInTournament(tournamentList, userId) {
    for (let [id, tournament] of tournamentList) {
        if (tournament.isPlayer(userId)) {
            return (tournament);
        }
    }
    return (null);
}

async function tournamentHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    var tournament  = alreadyInTournament(this.tournamentList, user.id);
    
    if (tournament) {
        reply.send(tournament.toJSON());
        return;
    }

    if (room && (room.getState() !== "done")) {
        reply.send(JSON.stringify(room.generateMatch()));
        return ;
    }
    
    room = this.addPlayerToRoom(user);
    
    await waitForOpponent(room);
    
    reply.send(JSON.stringify(room.generateMatch()));

    room.on("done", () => {
        if (room.getState() === "done") {
            this.db.addMatch(room.toJSON());
        }
    })
}

export default async function playWithSomeOne(fastify, options) {

    fastify.decorate("currentTournament", null);
    fastify.decorate("tournamentList", new Map());

    fastify.route({
        url     : '/pongGame/tournament',
        method  : 'GET',
        handler : tournamentHandler,
    })
}