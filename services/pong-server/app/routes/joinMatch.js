import { alreadyInMatch } from "./playWithSomeOne.js";
import { waitForOpponent } from "./playWithSomeOne.js";

async function joinMatchHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    const rid = request.query.rid

    let room = alreadyInMatch(this.roomList, user.id);

    if (room && (room.id !== rid) && (room.getState() !== "done") && (room.getState() !== "canceled")) {
        const error = new Error("You are already in other match!!")
        error.statusCode = 400;
        throw error;
    }

    room = this.roomList.get(rid);
    if (room)
        console.log("-------------++++++", room.id, " -----------+++++", room.state)
    if (!room || (room.getState() === "done") || (room.getState() === "canceled") || !room.isMember(user.id)) {
        const error = new Error("Currently you don't have any match to join!!")
        error.statusCode = 404;
        throw error;
    }

    if (room.tournament) {
        if (room.tournament && !room.tournament.isMember(user.id)) {
            const error = new Error("You don't have access to this tournament anymore!!")
            error.statusCode = 404;
            throw error;
        }
    }

    room.joinRoom(user);

    await waitForOpponent(room);
    
    return (reply.send(JSON.stringify(room.toJSON())));
}

export default async function joinMatch(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/joinMatch',
        method  : 'GET',
        handler : joinMatchHandler,
    })
}