import { waitForOpponent }  from "./playWithSomeOne.js";
import Room from "../gameClasses/roomClass.js";
import Invitation from "../gameClasses/invitationClass.js";
import userSchema from "../schemas/userSchema.js";

async function inviteHandler(request, reply) {
    const user       = request.user;
    const state = this.validateUser(user);

    if (!state) {
        reply.code(400);
        throw new Error("Invalid user passed to handler!!");
    }

    const friend     = request.body;
    
    if (user.id === friend.id) {
        reply.code(400);
        throw new Error("You try to invite your self!!", "E101")
    }

    var room = alreadyInMatch(this.roomList, user.id);
    
    if (room && (room.getState() !== "done")) {
        reply.code(409);
        throw new Error("You are already in match!!", "E102");
    }
    
    room = new Room();

    room.addPlayer(user);
    this.roomList.set(room.id, room);
    
    const invitation = new Invitation("InviteToMatch", user, friend, room);
    
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

    fastify.decorate("invitationList", new Map());

    fastify.route({
        url     : '/pongGame/remote/inviteFriend',
        method  : 'post',
        schema  : userSchema,
        handler : inviteHandler,
    })
}