import PongError from "../classes/PongError.js"
import Tournament from "../classes/tournamentClass.js";

export function alreadyInTournament(tournamentList, userId) {
    for (let [id, tournament] of tournamentList) {
        if (tournament.isMember(userId)) {
            return (tournament);
        }
    }
    return (null);
}

async function joinTournamentHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        throw new PongError(400, "Pass Invalid User To Handler!!");
    }

    let tournament  = alreadyInTournament(this.tournamentList, user.id);
    
    if (tournament) {
        reply.send(tournament.toJSON());
        return;
    }

    if (50 < this.roomList.size) {
        throw new PongError(503, "Service Unavailable!!");
    }

    if (!this.currentTournament || (this.currentTournament.state !== "waiting")) {
        let tournament = new Tournament();

        this.tournamentList.set(tournament.id, tournament);
        
        tournament.on("newRoom", (room) => {
            this.addToRoomList(room);
        })

        this.currentTournament = tournament;
    }

    this.currentTournament.addMember(user);
    
    return reply.send(this.currentTournament.toJSON());
}

async function leaveTournamentHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        throw new PongError(400, "Invalid User Passed To Handler!!");
    }

    let tournament  = alreadyInTournament(this.tournamentList, user.id);
    
    if (!tournament) {
        throw new PongError(404, "Currently you are not belong to any tournament!!");
    }

    tournament.removeMember(user.id);

    if ((tournament.members.length === 0) && (tournament.state !== "waiting")) {
        this.tournamentList.delete(tournament.id);
    }

    return (reply.send("Leave it successfully"));
}

export default async function tournament(fastify, options) {

    fastify.decorate("currentTournament", null);
    fastify.decorate("tournamentList", new Map());

    fastify.route({
        url     : '/pongGame/remote/tournament/join',
        method  : 'GET',
        handler : joinTournamentHandler,
    })

    fastify.route({
        url     : '/pongGame/remote/tournament/leave',
        method  : 'GET',
        handler : leaveTournamentHandler,
    })
}
