import Tournament from "../classes/tournamentClass.js";

export function alreadyInTournament(tournamentList, userId) {
    for (let [id, tournament] of tournamentList) {
        if (tournament.isMember(userId)) {
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

    let tournament  = alreadyInTournament(this.tournamentList, user.id);
    
    if (tournament) {
        reply.send(tournament.toJSON());
        return;
    }

    if (!this.currentTournament || (this.currentTournament.state !== "waiting")) {
        let tournament = new Tournament();

        this.tournamentList.set(tournament.id, tournament);

        tournament.on("done", () => {
            console.log("remove the tournament with Id: ", tournament.id);
            this.tournamentList.delete(tournament.id);
        });
        
        tournament.on("newRoom", (room) => {
            this.addRoomToRoomList(room);
        })
        this.currentTournament = tournament;
    }

    this.currentTournament.addMember(user);

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