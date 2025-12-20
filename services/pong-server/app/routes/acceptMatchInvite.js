import { waitForOpponent } from "./playWithSomeOne.js";
import acceptQuerySchema from "../schemas/acceptQuerySchema.js";

async function acceptHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        reply.code(400);
        throw new Error("Invalid user passed to handler!!");
    }

    const iid         = request.query.iid;
    const invitation  = this.invitationList.get(iid);

    if (!invitation || invitation.expired() || !invitation.invited(user.id)) {
        reply.code(410);
        throw new Error("Error: either you are not invited, or invitation is gone", "E301");
    }

    var room = alreadyInMatch(this.roomList, user.id);
    
    if (room && (room.getState() !== "done")) {
        reply.code(409);
        throw new Error("You are already in match!!", "E102");
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