
import playWithSomeOne from "./playWithSomeOne.js";
import playWithFriend from "./playWithFriend.js";
import tournament from "./tournament.js";
import joinMatch from "./joinMatch.js";
import match from "./match.js";
import customization from "./customization.js";
import pongStatistics from "./pongStatistics.js";
import onRequestHook from "../hooks/onRequestHook.js";
import PongError from "../classes/PongError.js";

export function alreadyInMatch(roomList, userId) {
    for (let [id, room] of roomList) {
        if (room.isPlayer(userId)) {
            return (room);
        }
    }
    return (null);
}

function addToRoomList(room) {
    try {
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
    } catch (err) {
        throw new PongError(503, "Error during adding room to list!!");
    }
}

export default async function pongGame(fastify) {

    fastify.decorate('roomList', new Map());
    fastify.decorate('currentRoom', null);
    fastify.decorate("invitationList", new Map());

    fastify.decorate('addToRoomList', addToRoomList);

    fastify.register(onRequestHook);
    
    fastify.register(playWithFriend);
    fastify.register(joinMatch);
    fastify.register(tournament);
    fastify.register(customization);
    fastify.register(match);
    fastify.register(pongStatistics);
    fastify.register(playWithSomeOne);
}
