import GenericRoom from "../classes/genericRoom.js";
import inviteSchema from "../schemas/inviteSchema.js";
import acceptSchema from "../schemas/acceptSchema.js";
import Invitation from "../classes/invitationClass.js";

function checkIsInvited(senderId, inviteeId) {
    const invitations = this.invitaionList.get(senderId);

    if (invitations) {
        for (let invitaion of invitations) {
            if (invitaion && invitaion.isInvited(inviteeId)) {
                return true;
            }
        }
    }
    return false;
}

function addToInvitationList(invitation) {
    if (invitation) {
        const senderId = invitation.senderId;
        let invitations = this.invitationList.get(senderId);

        if (!invitations) {
            invitations = [];
            this.invitationList.set(senderId, invitations);
        }

        if (!invitations.find((inv) => inv.id === invitation.id)) {
            invitations.push(invitation);
            this.log.info(`add invitation with id: ${invitation.id}`);
            invitation.on("done", () => {
                this.log.info(`delete invitation with id: ${invitation.id}`);
                this.invitaionList.set(
                    senderId, invitations.filter((inv) => inv.id !== invitation.id)
                );
            })
        }
    }
}

async function acceptHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error
    }

    const uid = request.query.uid;

    const invitations = this.invitationList.get(uid);

    if (!invitations || !checkIsInvited(invitations, user.id)) {
        const error = new Error("Either you are not invited, or invitation is gone");
        error.statusCode = 400;
        throw error
    }

    const room = new GenericRoom();

    this.addToRoomList(room);

    room.addMember(user.id);

    room.addMember(uid);

    await room.inviteMembers();

    return reply.send("ok");
}

async function inviteHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    const fid = request.query.fid;
  
    if (user.id === fid) {
        const error = new Error("You try to invite your self!!");
        error.statusCode = 400;
        throw error;
    }

    let invitations = this.invitaionList.get(user.id)
    
    if (invitations && checkIsInvited(invitations, fid)) {
        const error = new Error("You already invite him!!");
        error.statusCode = 400;
        throw error;
    }

    const invitation = new Invitation(user.id, fid);

    invitations.push(invitation);

    invitation.waitForInvitee();
    
    invitation.on("done", () => {
        invitations = invitations.filter((i) => i.id !== invitation.id);
    });

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

export default async function playWithFriend(fastify, options) {

    fastify.decorate("invitationList", new Map());
    fastify.decorate("checkIsInvited", checkIsInvited);
    fastify.decorate("addToInvitaionList", addToInvitationList);

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
