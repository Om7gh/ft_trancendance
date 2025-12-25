import acceptQuerySchema from "../schemas/acceptQuerySchema.js";
import { waitForOpponent, alreadyInMatch } from "./playWithSomeOne.js";

async function acceptHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error
    }

    const rid = request.query.rid;

    const room = this.roomList.get(rid);

    if (!room || (room.getState() !== "Waiting") || !room.isMemeber(user.id)) {
        const error = new Error("Either you are not invited, or invitation is gone");
        error.statusCode = 400;
        throw error
    }

    await room.inviteMembers();

    return reply.send("ok");
}

export default async function acceptMatchInvitation(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/acceptmatchinvitation',
        method  : 'GET',
        schema  : acceptQuerySchema,
        handler : acceptHandler,
    })

}