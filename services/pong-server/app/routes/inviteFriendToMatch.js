import { alreadyInMatch, waitForOpponent }  from "./playWithSomeOne.js";
import Room from "../gameClasses/roomClass.js";
import Invitation from "../gameClasses/invitationClass.js";
import inviteQuerySchema from "../schemas/inviteQuerySchema.js";

async function inviteHandler(request, reply) {
    try {
    const user  = request.user;
    const state = this.validateUser(user);
    console.log("user+++++++",user, "state++++++++",state);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    const fid = request.query.fid;
    // id == uid
    if (user.id === fid) {
        const error = new Error("You try to invite your self!!");
        error.statusCode = 400;
        throw error;
    }

    var room = alreadyInMatch(this.roomList, user.id);

    console.log("room ++++ ",room)
    
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

        const response = await this.axios.post("http://notification:9005/notification/send",
            {
                data: [invitation.toJSON(),]
            }
        )
        
        await waitForOpponent(room)
        
        reply.send(JSON.stringify(room.generateMatch()));
    } catch (e) {
        console.log("error from catch block", e);
        throw e;
    }
}


export default async function inviteFriendToMatch(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/inviteFriend',
        method  : 'GET',
        // schema  : inviteQuerySchema,
        handler : inviteHandler,
    })
}