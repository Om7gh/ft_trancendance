import GenericRoom from "../classes/genericRoom.js";
import inviteQuerySchema from "../schemas/inviteQuerySchema.js";
import { alreadyInMatch }  from "./playWithSomeOne.js";

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

    var room = alreadyInMatch(this.roomList, user.id);
    
    if (room && (room.getState() !== "done")) {
        const error = new Error("You are already in match!!");
        error.statusCode = 409;
        throw error;
    }
    
    room = new GenericRoom();
    room.addMember(user.id);
    room.addMember(fid);

    this.addRoomToRoomList(room);

    await this.axios.post("http://notification:9005/send",
        {data: [{
            id: room.id,
            type: "inviteToMatch",
            sender: {id: user.id, username: user.username, avatar: user.avatar},
            receiver: {id: fid},
            expire: (Math.floor(Date.now() / 1000) + 60),
        },]}
    );

    room.waitMembersToJoin();

    return (reply.send("Invited!!"));
}


export default async function inviteFriendToMatch(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/inviteFriend',
        method  : 'GET',
        schema  : inviteQuerySchema,
        handler : inviteHandler,
    })
}