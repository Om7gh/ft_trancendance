import PongError from "../classes/PongError.js";
import { alreadyInMatch } from "./pongGame.js";
import { waitForOpponent } from "./playWithSomeOne.js";
import joinMatchSchema from "../schemas/joinMatchSchema.js";

async function joinMatchHandler(request, reply) {
    const user  = request.user;
    const rid   = request.query.rid;
    const state = this.validateUser(user);

    if (!state) {
        throw new PongError(400, "Invalid User Passed To Handler!!");
    }

    let room = alreadyInMatch(this.roomList, user.id);

    if (room && (room.id !== rid) && !room.isDone()) {
        throw new PongError(409, "You are already in other match!!");
    }

    room = this.roomList.get(rid);

    if (!room || !room.isMember(user.id) || room.isDone()) {
        throw new PongError(404, "Currently you don't have any match to join!!");
    }

    if (room.tournament && !room.tournament.isMember(user.id)) {
        throw new PongError(404, "User is not member of room's tournament!!");
    }

    if (room.isPaused()) {
        return reply.send(room.toJSON());
    }
    
    room.joinRoom(user);

    await waitForOpponent(room);
    
    return (reply.send(JSON.stringify(room.toJSON())));
}

export default async function joinMatch(fastify) {

    fastify.route({
        url     : '/pongGame/remote/joinMatch',
        method  : 'GET',
        schema  : joinMatchSchema,
        handler : joinMatchHandler,
    })
}