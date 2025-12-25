import onRequestHook from "../hooks/onRequestHook.js";
import playWithSomeOne from "./playWithSomeOne.js";
import inviteFriendToMatch from "./inviteFriendToMatch.js";
import acceptMatchInvitation from "./acceptMatchInvitation.js";
import errorHandler from "../plugins/errorHandler.js";
import fakeFriends from "./fakeFriends.js";
import tournament from "./tournament.js";
import joinMatch from "./joinMatch.js";
import match from "./match.js";


function addRoomToRoomList(room) {
    if (room && !this.roomList.get(room.id)) {
        this.roomList.set(room.id, room);
        this.log.info(`add room with id: ${room.id}`);

        room.on("done", () => {
            if ((room.type === "match") && (room.getState() === "done")) {
                this.db.addMatch(room.toJSON());
            }
            this.log.info(`delete room with id: ${room.id}`);
            this.roomList.delete(room.id);
        })
    }
}

export default async function pongGame(fastify, options) {
    
    fastify.decorate('currentRoom', null);
    fastify.decorate('roomList', new Map());
    fastify.decorate("invitationList", new Map());

    fastify.decorate('addRoomToRoomList', addRoomToRoomList);

    fastify.register(onRequestHook);
    fastify.register(errorHandler);
    fastify.register(fakeFriends)

    fastify.register(playWithSomeOne);
    fastify.register(inviteFriendToMatch);
    fastify.register(acceptMatchInvitation);
    fastify.register(tournament);
    fastify.register(joinMatch);
    fastify.register(match);
}
