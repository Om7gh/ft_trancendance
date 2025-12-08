import { joinMatch } from "./joinMatch.js";
import { invite } from "./invitefriendToMatch.js";
import { playWithSomeOne } from "./playWithSomeOne.js";
import { Player, Room, Invitation } from "./pongClasses.js";

function generateId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
}

function getPlayerById(uid) {

    for (let player of this.playerList) {
        if (player.id === uid) {
            return (player);
        }
    }
    return (null);
}

function addPlayerToRoom(player) {

    if (!this.currentRoom || this.currentRoom.full() || (this.currentRoom.state === "done")) {
        this.currentRoom = new Room(this.generateId());
        this.log.info(`create new room with id: ${this.currentRoom.id}`);
    }

    if (this.currentRoom) {
        this.currentRoom.addPlayer(player);
        this.log.info(`add player with id: ${player.id} to room with id: ${this.currentRoom.id}`);
    }

    return (this.currentRoom);
}

function addToPlayerList(playerId) {
    var player = this.playerList.find((player) => player.id === playerId);

    if (!player) {
        player = new Player(playerId, null);
        
        if (player) {
            this.log.info(`add player with id: ${player.id} to playerList`);
            this.playerList.push(player);
        }
    }
    return (player);
}

export function pongGame(fastify, options, done) {

    fastify.decorate('playerList'       ,     new Array());

    fastify.decorate('currentRoom'      ,            null);

    fastify.decorate('generateId'       ,      generateId);

    fastify.decorate('getPlayerById'    ,   getPlayerById);

    fastify.decorate('addToPlayerList'  , addToPlayerList);

    fastify.decorate('addPlayerToRoom'  , addPlayerToRoom);

    // fastify.decorate('managePlayerList', managePlayerList)

    fastify.register(playWithSomeOne);
    fastify.register(joinMatch);
    fastify.register(invite);

    // this route for simulate the endpoint that going to provide the
    // the user friends.

    fastify.route({
        path: "/pongGame/remote/playerlist",
        method: "GET",
        handler: playerListHandler,
    })

    // fastify.manageRoomList();

    done();
}

// this is the handler for the friend simulate endpoint.

function playerListHandler(request, reply) {

    const uid = request.query.uid;
    const result = this.playerList.map((player) =>{
        if (player.id != uid)
            return player.id;
    });

    reply.send(JSON.stringify(result.filter((item) => item != null)));
}