import { alreadyInMatch } from "./pongGame.js";
import { waitForOpponent } from "./playWithSomeOne.js";
import joinMatchSchema from "../schemas/joinMatchSchema.js";

async function joinMatchHandler(request, reply) {
    const user  = request.user;
    const rid = request.query.rid;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!");
        error.type = "pongError";
        error.statusCode = 400;
        throw error;
    }

    let room = alreadyInMatch(this.roomList, user.id);

    if (room && (room.id !== rid) && !room.isDone()) {
        const error = new Error("You are already in other match!!");
        error.type = "pongError";
        error.statusCode = 409;
        throw error;
    }

    room = this.roomList.get(rid);

    if (!room || !room.isMember(user.id) || room.isDone()) {
        const error = new Error("Currently you don't have any match to join!!");
        error.type = "pongError";
        error.statusCode = 404;
        throw error;
    }

    if (room.tournament && !room.tournament.isMember(user.id)) {
        const error = new Error("User is not member of room's tournament!!");
        error.type = "pongError";
        error.statusCode = 404;
        throw error;
    }

    if (room.isPaused()) {
        return reply.send(room.toJSON());
    }
    
    room.joinRoom(user);

    await waitForOpponent(room);
    
    return (reply.send(JSON.stringify(room.toJSON())));
}

export default async function joinMatch(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/joinMatch',
        method  : 'GET',
        schema  : joinMatchSchema,
        handler : joinMatchHandler,
    })
}