import { Room, Invitation } from "./pongClasses.js";
import { waitForOpponent }  from "./playWithSomeOne.js";

async function inviteFriendToMatch(request, reply) {
    try {
        const uid       = request.user.id;
        const fid       = request.query.fid;
        const player    = this.addToPlayerList(request.user);
        
        if (!player) {
            reply.code(503);
            throw new Error("Server is temporarily overloaded!!", "E100");
        }
        
        if (player.inMatch()) {
            reply.code(409);
            throw new Error("You are already in match", "E101");
        } 
        
        const room = this.addToNewRoom(player);
        
        if (!room) {
            reply.code(503);
            throw new Error("Server is temporarily overloaded!!", "E102");
        }
        
        const invitation = new Invitation("InviteToMatch", uid, fid, room);
        
        if (!invitation) {
            reply.code(503);
            throw new Error("Server is temporarily overloaded!!", "E103");
        }
        
        this.invitationList.set(invitation.id, invitation);
        
        const response = await axios({
            url: "http://notification:9003/notification/send",
            method: "POST",
            data: JSON.stringify([invitation.toJSON(),]),
        })
        
        if (!answer) {
            reply.code(503);
            throw new Error("Error: from invite friend to match", "E103");
        }
        
        // this for prevent other users from joining room.
        
        this.currentRoom = null;
        
        try {
            await waitForOpponent(room)
            reply.code(200).send(JSON.stringify(room.generateMatch()));
        } catch (error) {
            reply.code(408).send({reason: "Error: Waiting too long!!", errorCode: "E204"});
            room.stopMatch();
        }
    } catch (error) {
        if (!reply.status) {
            reply.code()
        }
        reply.code(503).send();
    }
}

async function acceptMatchInvitation(request, reply) {
    const uid         = request.user.uid;
    const iid         = request.query.iid;
    const player      = this.addToPlayerList(uid);
    const invitation  = this.invitationList.get(iid);

    if (!player) {
        reply.code(503);
        throw new Error("Error: from accept match invitation", "E300");
    }

    if (!invitation || invitation.expired() || !invitation.invited(uid)) {
        reply.code(410);
        throw new Error("Error: either you are not invited, or invitation is gone", "E301");
    }

    const room = invitation.room;

    if (!room) {
        reply.code(503);
        throw new Error("Error: from accept match invitation", "E302");
    }

    room.addPlayer(player);

    this.invitationList.delete(iid);

    await waitForOpponent(room)
        .then(() => {
            reply.code(200).send(JSON.stringify(room.generateMatch()));
        })
        .catch(() => {
            reply.code(408).send({reason: "Error: Waiting too long!!", errorCode: "E203"});
            room.stopMatch();
        });
}

function playWithFriendHandler(request, reply) {
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

export default function playWithFriend(fastify, options, done) {

    fastify.decorate("invitationList", new Map());

    fastify.decorate("inviteFriendToMatch", inviteFriendToMatch);
    fastify.decorate("acceptMatchInvitation", acceptMatchInvitation);

    fastify.route({
        url     : '/pongGame/remote/invite',
        method  : 'GET',
        handler : playWithFriendHandler,
    })

    done();
}