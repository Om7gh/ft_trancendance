import { Room, Invitation } from "./pongClasses.js";
import { waitForOpponent } from "./playWithSomeOne.js";

function inviteFriendToMatch(request, reply) {
    const uid       = request.query.uid;
    const oid       = request.query.oid;
    const player    = this.addToPlayerList(uid);
    const opponent  = this.addToPlayerList(oid);


    if (!player || !opponent) {
        reply.code(500).send();
        return;
    }

    if (player.inMatch()) {
        reply.code(409).send();
        return ;
    } 

    const room = this.addToNewRoom(player);

    if (!room) {
        reply.code(500).send();
        return;
    }

    const invitation = new Invitation(this.generateId(), uid, oid, room);

    if (!invitation) {
        reply.code(500).send();
        return;
    }

    this.invitationList.push(invitation);

    this.notifications.set(oid, [{type: "invite_to_match", id: invitation.id}]);

    waitForOpponent(reply, room, uid); 
}

function acceptMatchInvitation(request, reply) {
    const uid           = request.query.uid;
    const iid           = request.query.iid;
    const player        = this.playerList.find((item) => item.id === uid);
    const invitation    = this.invitationList.find((item) => item.id === iid);

    if (!player || !invitation || invitation.expired() || !invitation.invited(uid))
        reply.code(404).send();

    const room = invitation.room;

    if (!room) {
        reply.code(500).send();
        return;
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
            reply.code(400).send();
        }
    }
}

export function invite(fastify, options, done) {
    fastify.decorate("invitationList", new Array());

    fastify.decorate("inviteFriendToMatch", inviteFriendToMatch);
    fastify.decorate("acceptMatchInvitation", acceptMatchInvitation);

    fastify.route({
        url: '/pongGame/remote/invite',
        method: 'GET',
        handler: inviteHandler,
    })

    done();
}