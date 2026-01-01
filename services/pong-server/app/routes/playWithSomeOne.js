import { alreadyInMatch } from "./pongGame.js";
import GenericRoom from "../classes/genericRoom.js";


export async function waitForOpponent(room) {
    let counter = 0;
    let intervalId = null;

    return (new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
            if (room.isReady()) {
                clearInterval(intervalId);
                resolve();
            } else if (60 < counter) {
                room.cancelMatch();
                clearInterval(intervalId);
                const error = new Error("Waiting for opponent too long!!");
                error.type = "pongError";
                error.statusCode = 409;
                reject(error);
            }
            counter++;
        }, 1000);
    }))
}

async function playWithSomeOneHandler(request, reply) {
    const user          = request.user;
    const state         = this.validateUser(user);
    let   currentRoom   = this.currentRoom;

    if (!state) {
        const error = new Error("Invalid user passed to handler!!");
        error.type = "pongError";
        error.statusCode = 400;
        throw error;
    }

    let room = alreadyInMatch(this.roomList, user.id);
    
    if (room && !room.isDone()) {
        if (room.tournament) {
            if (room.tournament.isMember(user.id)) {
                return reply.send(room.toJSON());
            }
        } else {
            return reply.send(room.toJSON());
        }
    }

    if (!currentRoom || !currentRoom.isWaiting()) {
        currentRoom = new GenericRoom();
        this.addToRoomList(currentRoom);
        this.currentRoom = currentRoom;
    }

    currentRoom.addPlayer(user);
    
    await waitForOpponent(currentRoom);

    reply.send(JSON.stringify(currentRoom.toJSON()));
}

export default async function playWithSomeOne(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/someone',
        method  : 'GET',
        handler : playWithSomeOneHandler,
    })
}