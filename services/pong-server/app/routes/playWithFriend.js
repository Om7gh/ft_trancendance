import inviteSchema from "../schemas/inviteSchema.js";
import PongError from "../classes/PongError.js";
import GenericRoom from "../classes/genericRoom.js";
import acceptSchema from "../schemas/acceptSchema.js";
import Invitation from "../classes/invitationClass.js";

function checkIsInvited(senderId, inviteeId) {
    const invitations = this.invitationList.get(senderId);

    if (invitations) {
        for (let [id, invitation] of invitations) {
            if (invitation.isInvited(inviteeId)) {
                return invitation;
            }
        }
    }
    return null;
}

function addToInvitationList(invitation) {
    if (invitation) {
        const senderId = invitation.senderId;
        let invitations = this.invitationList.get(senderId);
        
        if (!invitations) {
            invitations = new Map();
            this.invitationList.set(senderId, invitations);
        }

        this.log.info(`add invitation with id: ${invitation.id}`);

        if (!invitations.get(invitation.id)) {
            invitations.set(invitation.id, invitation);
            invitation.on("done", () => {
                this.log.info(`delete invitation with id: ${invitation.id}`);
                invitations.delete(invitation.id);
            });
        }
    }
}

async function acceptHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        throw new PongError(400, "Invalid User Passed To Handler!!");
    }

    const sid = request.query.sid;

    const invitation = this.checkIsInvited(sid, user.id);

    if (!invitation) {
        throw new PongError(404, "Either you are not invited, or invitation is gone!!");
    } else {
        invitation.accepted();
    }

    if (50 < this.roomList.size) {
        throw new PongError(503, "Service Unavailable!!");
    }

    const room = new GenericRoom();
    this.addToRoomList(room);
    room.addMember(user.id);
    room.addMember(sid);

    await room.inviteMembers();

    return reply.send("accepted successfully");
}

async function inviteHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        throw new PongError(400, "Invalid User Passed To Handler!!");
    }

    const fid = request.query.fid;
  
    if (user.id === fid) {
        throw new PongError(422, "You try to invite your self!!");
    }
    
    if (this.checkIsInvited(user.id, fid)) {
        throw new PongError(404, "You try to invite your self!!");
    }

    const invitation = new Invitation(user.id, fid);
    this.addToInvitationList(invitation);
    invitation.waitForInvitee();

    await this.axios.post("http://notification:9005/send",
        {data: [{
            id: invitation.id,
            type: "inviteToMatch",
            sender: {id: user.id, username: user.username, avatar: user.avatar},
            receiver: {id: fid},
            expireTime: (Math.floor(Date.now() / 1000) + 60),
        },]}
    );

    return (reply.send("Invited!!"));
}

export default async function playWithFriend(fastify) {

    fastify.decorate("invitationList", new Map());
    fastify.decorate("checkIsInvited", checkIsInvited);
    fastify.decorate("addToInvitationList", addToInvitationList);

    fastify.route({
        url     : '/pongGame/remote/inviteFriend',
        method  : 'GET',
        schema  : inviteSchema,
        handler : inviteHandler,
    })

    fastify.route({
        url     : '/pongGame/remote/acceptInvitation',
        method  : 'GET',
        schema  : acceptSchema,
        handler : acceptHandler,
    })
}
