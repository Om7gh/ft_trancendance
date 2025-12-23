import Room from "../classes/roomClass.js";
import Invitation from "../classes/invitationClass.js";
import inviteQuerySchema from "../schemas/inviteQuerySchema.js";
import { alreadyInMatch, waitForOpponent }  from "./playWithSomeOne.js";

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
    room.on("done", () => {
        if (room.getState() === "done") {
            this.db.addMatche(room.toJSON());
        }
        this.roomList.delete(room.id);
    })
    
    const invitation = new Invitation("InviteToMatch", user, {id: fid, username: "", avatar: ""}, room);
    
    this.invitationList.set(invitation.id, invitation);

    await this.axios.post("http://notification:9005/send",
        {data: [invitation.toJSON(),]}
    );
    
    await waitForOpponent(room)
    
    reply.send(JSON.stringify(room.generateMatch()));
}


export default async function inviteFriendToMatch(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/inviteFriend',
        method  : 'GET',
        schema  : inviteQuerySchema,
        handler : inviteHandler,
    })
}