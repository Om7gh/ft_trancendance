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

    let room = alreadyInMatch(this.roomList, user.id);
            
    if (room && (room.getState() !== "done") && (room.getState() !== "canceled")) {
        const error = new Error("You are already in other match!!")
        error.statusCode = 400;
        throw error;
    }

    const rid = request.query.rid

    room = this.roomList.get(rid);

    if (!room || (room.getState() !== "waiting") || !room.isMember(user.id)) {
        const error = new Error("Currently you don't have any match to join!!")
        error.statusCode = 499;
        throw error;
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