import onRequestHook from "../hooks/onRequestHook.js";
import errorHandler from "../plugins/errorHandler.js";
import Tournament from "../classes/tournamentClass.js";

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

    if (!this.currentTournament || (this.currentTournament.state !== "waiting")) {
        this.currentTournament = new Tournament();
        this.tournamentList.set(this.currentTournament.id, this.currentTournament);
        this.currentTournament.on("done", () => {
            let tournamentId = this.currentTournament.id;
            this.tournamentList.delete(tournamentId);
            console.log("remove the tournament with Id: ", tournamentId);
        });
    }

    this.currentTournament.addPlayer(user);

    reply.send(this.currentTournament.toJSON());
}

export default async function tournament(fastify, options) {

    fastify.decorate("currentTournament", null);
    fastify.decorate("tournamentList", new Map());

    fastify.route({
        url     : '/pongGame/remote/tournament',
        method  : 'GET',
        handler : tournamentHandler,
    })
}