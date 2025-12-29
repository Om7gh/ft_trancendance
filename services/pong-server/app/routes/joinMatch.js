import { alreadyInMatch } from "./pongGame.js";
import { waitForOpponent } from "./playWithSomeOne.js";
import joinMatchQuerySchema from "../schemas/joinMatchQuerySchema.js";

async function joinMatchHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    const rid = request.query.rid;

    console.log("___________________> ", rid);

    let room = alreadyInMatch(this.roomList, user.id);

    if (room && (room.id !== rid) && !room.isDone()) {
        const error = new Error("You are already in other match!!")
        error.statusCode = 404;
        throw error;
    }

    room = this.roomList.get(rid);

    if (!room || !room.isMember(user.id) || room.isDone()) {
        const error = new Error("Currently you don't have any match to join!!")
        error.statusCode = 404;
        throw error;
    }

    if (!room.tournament) {
        const error = new Error("Room is not belong to any tournament!!")
        error.statusCode = 404;
        throw error;
    }

    if (!room.tournament.isMember(user.id)) {
        const error = new Error("User is not a tournamnet's member!!")
        error.statusCode = 404;
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
        schema  : joinMatchQuerySchema,
        handler : joinMatchHandler,
    })
}