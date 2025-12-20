import onRequestHook from "../hooks/onRequestHook.js";
import playWithSomeOne from "./playWithSomeOne.js";
import inviteFriendToMatch from "./inviteFriendToMatch.js";
import acceptMatchInvitation from "./acceptMatchInvitation.js";
import joinMatch from "./joinMatch.js";
import Room from "../gameClasses/roomClass.js";
import errorHandler from "../plugins/errorHandler.js";

// import fakeFriends      from "./fakeFriends.js";


function createRoom() {
    const room = new Room();

    this.log.info(`create new room with id: ${room.id}`);
    this.roomList.set(room.id, room);
    room.on("done", () => {
        this.roomList.delete(room.id);
        this.log.info(`delete room with id: ${room.id}`);
    })
    return (room);
}

function addPlayerToRoom(user) {

    if (!this.currentRoom || (this.currentRoom.getState() !== "waiting")) {
        this.currentRoom = this.createRoom();
    }

    if (this.currentRoom) {
        this.currentRoom.addPlayer(user);
        this.log.info(`add player with id: ${user.id} to room with id: ${this.currentRoom.id}`);
    }

    return (this.currentRoom);
}

export default function pongGame(fastify, options, done) {
    
    fastify.decorate('currentRoom', null);
    fastify.decorate('roomList', new Map());
    fastify.decorate("invitationList", new Map());

    fastify.decorate('createRoom', createRoom);
    fastify.decorate('addPlayerToRoom', addPlayerToRoom);

    fastify.register(onRequestHook);
    fastify.register(errorHandler);

    fastify.register(playWithSomeOne);
    fastify.register(inviteFriendToMatch);
    fastify.register(acceptMatchInvitation);
    fastify.register(joinMatch);

    // fastify.register(fakeFriends);

    done();
}
