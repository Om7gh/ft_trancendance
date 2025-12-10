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

async function onRequestHookHandler(req, rep) {
    const cookies = req.cookies;

    console.log("==>", cookies);

    const user = await this.axios.get("http://identity:4000/auths/userinfo", {
        headers: {
            Cookies: 
        }
    });

    // console.log("==>", user);
}

export function pongGame(fastify, options, done) {

    fastify.decorate('playerList'       ,     new Array());

    fastify.decorate('currentRoom'      ,            null);

    fastify.decorate('generateId'       ,      generateId);

    fastify.decorate('getPlayerById'    ,   getPlayerById);

    fastify.decorate('addToPlayerList'  , addToPlayerList);

    fastify.decorate('addPlayerToRoom'  , addPlayerToRoom);

    fastify.addHook('onRequest', onRequestHookHandler);

    fastify.register(playWithSomeOne);
    fastify.register(joinMatch);
    fastify.register(invite);

    done();
}
