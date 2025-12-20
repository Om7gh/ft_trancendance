import { waitForOpponent }  from "./playWithSomeOne.js";
import Room from "../gameClasses/roomClass.js";
import Invitation from "../gameClasses/invitationClass.js";
import inviteQuerySchema from "../schemas/inviteQuerySchema.js";

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
    
    room = new Room();
    room.addPlayer(user);
    this.roomList.set(room.id, room);
    
    const invitation = new Invitation("InviteToMatch", user, fid, room);
    
    this.invitationList.set(invitation.id, invitation);
    
    const response = await this.axios.post({
        url: "http://notification:9003/notification/send",
        method: "POST",
        data: [invitation.toJSON(),]
    })
    
    await waitForOpponent(room)

    reply.send(JSON.stringify(room.generateMatch()));
}


export default async function inviteFriendToMatch(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/inviteFriend',
        method  : 'get',
        schema  : inviteQuerySchema,
        handler : inviteHandler,
    })
}