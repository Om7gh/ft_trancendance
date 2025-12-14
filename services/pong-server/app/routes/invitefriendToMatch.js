import { Room, Invitation } from "./pongClasses.js";
import { waitForOpponent } from "./playWithSomeOne.js";

function inviteFriendToMatch(request, reply) {
    const uid       = request.user.id;
    const oid       = request.query.oid;
    const player    = this.addToPlayerList(request.user);


    if (!player) {
        reply.code(503);
        throw new Error("Error: from invite friend to match", "E100");
    }

    if (player.inMatch()) {
        reply.code(409);
        throw new Error("Error: the invited already in match", "E101");
    } 

    const room = this.addToNewRoom(player);

    if (!room) {
        reply.code(503);
        throw new Error("Error: from invite friend to match", "E102");
    }

    const invitation = new Invitation(this.generateId(), uid, oid, room);
    
    if (!invitation) {
        reply.code(503);
        throw new Error("Error: from invite friend to match", "E103");
    }

    // this for prevent other users from joining room.

    this.currentRoom = null;

    waitForOpponent(reply, room, uid); 
}

function acceptMatchInvitation(request, reply) {
    const uid         = request.user.uid;
    const iid         = request.query.iid;
    const player      = this.addToPlayerList(uid);
    const invitation  = this.invitationList.find((item) => item.id === iid);

    if (!player) {
        reply.code(503);
        throw new Error("Error: from accept match invitation", "E300");
    }

    if (!invitation || invitation.expired() || !invitation.invited(uid)) {
        reply.code(410);
        throw new Error("Error: either not invited or invitation is gone", "E301");
    }

    const room = invitation.room;

    if (!room) {
        reply.code(503);
        throw new Error("Error: from accept match invitation", "E302");
    }

    room.addPlayer(player);

    this.invitationList = this.invitationList.filter((item) => item.id != iid);

    waitForOpponent(reply, room, uid);
}

function inviteHandler(request, reply) {
    const query = request.query.q;

    switch (query) {
        case "send": {
            this.inviteFriendToMatch(request, reply);
            return ;
        }
        case "accept": {
            this.acceptMatchInvitation(request, reply);
            return ;
        }
        default : {
            reply.code(404).send();
        }
    }
}

export function invite(fastify, options, done) {

    fastify.decorate("invitationList", new Array());

    fastify.decorate("inviteFriendToMatch", inviteFriendToMatch);
    fastify.decorate("acceptMatchInvitation", acceptMatchInvitation);

    fastify.route({
        url     : '/pongGame/remote/invite',
        method  : 'GET',
        handler : inviteHandler,
    })

    done();
}