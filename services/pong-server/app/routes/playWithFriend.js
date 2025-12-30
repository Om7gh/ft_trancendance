import { alreadyInMatch } from "./pongGame.js";
import GenericRoom from "../classes/genericRoom.js";
import inviteSchema from "../schemas/inviteSchema.js";
import acceptSchema from "../schemas/acceptSchema.js";


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

    if (!room || !room.isMember(user.id) || !room.isWaiting()) {
        const error = new Error("Either you are not invited, or invitation is gone");
        error.statusCode = 400;
        throw error
    }

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

    let room = alreadyInMatch(this.roomList, user.id);
    
    if (room && !room.isDone()) {
        const error = new Error("You are already in match!!");
        error.statusCode = 409;
        throw error;
    }
    
    room = new GenericRoom();

    this.addToRoomList(room);

    room.addMember(user.id);

    room.addMember(fid);

    room.waitMembersToJoin();

    await this.axios.post("http://notification:9005/send",
        {data: [{
            id: room.id,
            type: "inviteToMatch",
            sender: {id: user.id, username: user.username, avatar: user.avatar},
            receiver: {id: fid},
            expireTime: (Math.floor(Date.now() / 1000) + 60),
        },]}
    );

    return (reply.send("Invited!!"));
}


export default async function playWithFriend(fastify, options) {

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
