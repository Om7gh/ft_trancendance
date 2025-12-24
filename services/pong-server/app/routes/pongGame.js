import onRequestHook from "../hooks/onRequestHook.js";
import playWithSomeOne from "./playWithSomeOne.js";
import inviteFriendToMatch from "./inviteFriendToMatch.js";
import acceptMatchInvitation from "./acceptMatchInvitation.js";
import joinMatch from "./joinMatch.js";
import errorHandler from "../plugins/errorHandler.js";
import fakeFriends from "./fakeFriends.js";
import tournament from "./tournament.js";
import GenericRoom from "../classes/genericRoom.js";


function createRoom() {
    const room = new GenericRoom();

    this.log.info(`create new room with id: ${room.id}`);
    this.roomList.set(room.id, room);
    room.on("done", () => {
        this.log.info(`delete room with id: ${room.id}`);
        if (room.getState() === "done") {
            this.db.addMatch(room.toJSON());
        }
        this.roomList.delete(room.id);
    })
    return (room);
}

export default async function pongGame(fastify, options) {
    
    fastify.decorate('currentRoom', null);
    fastify.decorate('roomList', new Map());
    fastify.decorate("invitationList", new Map());

    fastify.decorate('createRoom', createRoom);

    fastify.register(onRequestHook);
    fastify.register(errorHandler);
    fastify.register(fakeFriends)

    fastify.register(playWithSomeOne);
    fastify.register(inviteFriendToMatch);
    fastify.register(acceptMatchInvitation);
    fastify.register(tournament);
    fastify.register(joinMatch);
}
