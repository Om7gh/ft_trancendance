import { waitForOpponent } from "./playWithSomeOne.js";
import acceptQuerySchema from "../schemas/acceptQuerySchema.js";

async function acceptHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error
    }

    const iid         = request.query.iid;
    const invitation  = this.invitationList.get(iid);

    if (!invitation || invitation.expired() || !invitation.invited(user.id)) {
        const error = new Error("Either you are not invited, or invitation is gone");
        error.statusCode = 400;
        throw error
    }

    var room = alreadyInMatch(this.roomList, user.id);
    
    if (room && (room.getState() !== "done")) {
        const error = new Error("You are already in other match!!");
        error.statusCode = 409;
        throw error
    }

    room = invitation.getRoom();
    room.addPlayer(user);

    this.invitationList.delete(iid);

    await waitForOpponent(room);

    reply.send(JSON.stringify(room.generateMatch()));
}

export default async function acceptMatchInvitation(fastify, options) {
    fastify.route({
        url     : '/pongGame/remote/acceptmatchinvitation',
        method  : 'GET',
        schema  : acceptQuerySchema,
        handler : acceptHandler,
    })
}