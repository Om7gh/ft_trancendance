// import { Player, Room} from "./pongClasses.js";

import joinMatch        from "./joinMatch.js";
// import fakeFriends      from "./fakeFriends.js";
import playWithSomeOne  from "./playWithSomeOne.js";
// import invitation       from "./playWithFriend.js";
import onRequestHook from "../hooks/onRequestHook.js"

import Room from "../gameClasses/roomClass.js";

import { PongError } from './pongClasses.js';

function alreadyInMatch(userId) {
    for (let [id, room] of this.roomList) {
        if (room.isPlayer(userId)) {
            return (room);
        }
    }
    return (null);
}

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

    fastify.decorate('createRoom', createRoom);
    fastify.decorate('alreadyInMatch', alreadyInMatch);
    fastify.decorate('addPlayerToRoom', addPlayerToRoom);

    
    
    fastify.setErrorHandler((error, request, reply) => {
        if (error && (typeof(error) === PongError)) {
            reply.send(error.toJSON());
        } else {
            console.log(error);
            reply.code(500).send({reason: "Unexpected Error", errorCode: "E000"});
        }
    });
    
    fastify.register(onRequestHook);

    fastify.register(playWithSomeOne);
    // fastify.register(playWithFriend);
    fastify.register(joinMatch);
    // fastify.register(fakeFriends);

    done();
}
