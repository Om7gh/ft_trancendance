
import match from "./match.js";
import joinMatch from "./joinMatch.js";
import tournament from "./tournament.js";
import customization from "./customization.js";
import playWithFriend from "./playWithFriend.js";
import pongStatistics from "./pongStatistics.js";
import playWithSomeOne from "./playWithSomeOne.js";

export function alreadyInMatch(roomList, userId) {
    for (let [id, room] of roomList) {
        if (room.isPlayer(userId)) {
            return (room);
        }
    }
    return (null);
}

function addToRoomList(room) {
    if (room && !this.roomList.get(room.id)) {
        this.roomList.set(room.id, room);
        this.log.info(`add room with id: ${room.id}`);

        room.on("done", () => {
            if (this.validateRoom(room.toJSON())) {
                this.db.addMatch(room.toJSON());
            }
            this.log.info(`delete room with id: ${room.id}`);
            this.roomList.delete(room.id);
        });
    }
}

export default async function pongGame(fastify, options) {
    
    fastify.decorate('roomList', new Map());
    fastify.decorate('currentRoom', null);
    fastify.decorate("invitationList", new Map());

    fastify.decorate('addToRoomList', addToRoomList);
    
    fastify.register(playWithSomeOne);
    fastify.register(playWithFriend);
    fastify.register(pongStatistics);
    fastify.register(customization);
    fastify.register(tournament);
    fastify.register(joinMatch);
    fastify.register(match);
}
