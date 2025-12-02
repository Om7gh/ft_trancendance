import { joinMatch } from "./joinMatch.js";
import { invite } from "./invitefriendToMatch.js";
import { playWithSomeOne } from "./playWithSomeOne.js";
import { Player, Room, Invitation } from "./pongClasses.js";

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getRoomById(rid) {
    for (let room of this.roomList) {
        if (room.id === rid) {
            return (room);
        }
    }
    return (null);
}

function getPlayerById(uid) {
    for (let player of this.playerList) {
        if (player.id === uid) {
            return (player);
        }
    }
    return (null);
}

function addToExistRoom(player) {
    for (const room of this.roomList) {
        console.log("room id: ", room.id);
        if (room.waitingForPlayer() && room.addPlayer(player)) {
            this.log.info(`player with id: ${player.id} added to an exist room with id: ${room.id}`)
            return (room);
        }
    }
    return null;
}

function addToNewRoom(player) {
    try {
        const newRoom = new Room(this.generateId());
        
        if (newRoom) {
            newRoom.addPlayer(player);
            this.log.info(`player with id: ${player.id} added to new room with id: ${newRoom.id}`);
            this.roomList.push(newRoom);
            return (newRoom);
        }
    } catch (err) {
        console.log(err);
    }
    return (null);
}

function addPlayerToRoom(player) {
    var room = null;
    this.log.info(`the number of exist room is: ${this.roomList.length}`);

    room = this.addToExistRoom(player);

    if (!room) {
        room = this.addToNewRoom(player);
    }

    return (room);
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

function manageRoomList() {
    var newRoomList = [];
    var intervalId  = null;

    intervalId = setInterval(() => {
        // this.log.info(`roomlist length before clean: ${this.roomList.length}`)
        this.roomList = this.roomList.filter((item) => item.state !== "done");
        // this.log.info(`roomlist length after clean: ${this.roomList.length}`)
    }, 1000);
}

export function pongGame(fastify, options, done) {
    
    fastify.decorate('playerList', new Array());
    fastify.decorate('roomList', new Array());

    fastify.decorate('generateId', generateId);
    fastify.decorate('getPlayerById', getPlayerById);
    fastify.decorate('getRoomById', getRoomById);

    fastify.decorate('addToPlayerList', addToPlayerList);

    fastify.decorate('addPlayerToRoom', addPlayerToRoom);
    fastify.decorate('addToExistRoom', addToExistRoom);
    fastify.decorate('addToNewRoom', addToNewRoom);

    fastify.decorate('manageRoomList', manageRoomList)
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

    // fastify.roomsManager();
    fastify.manageRoomList();

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