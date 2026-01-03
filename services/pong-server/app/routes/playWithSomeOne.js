import { alreadyInMatch } from "./pongGame.js";
import PongError from "../classes/PongError.js";
import GenericRoom from "../classes/genericRoom.js";


export async function waitForOpponent(room) {
    let counter = 0;
    let intervalId = null;

    return (new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
            try {
                if (room.isReady()) {
                    clearInterval(intervalId);
                    resolve();
                } else if (30 < counter) {
                    reject(new PongError(409, "Waiting for opponent too long!!"));
                    clearInterval(intervalId);
                    room.cancelMatch();
                }
                counter++;
            } catch(err) {
                reject(new PongError(400, "Unexpected error!!"));
            }
        }, 1000);
    }))
}

async function playWithSomeOneHandler(request, reply) {
    const user          = request.user;
    const state         = this.validateUser(user);
    let   currentRoom   = this.currentRoom;

    if (!state) {
        throw new PongError(400, "Invalid User Passed To Handler!!");
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

    if (50 < this.roomList.size) {
        throw new PongError(503, "Service Unavailable!!");
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

export default async function playWithSomeOne(fastify) {

    fastify.route({
        url     : '/pongGame/remote/someone',
        method  : 'GET',
        handler : playWithSomeOneHandler,
    })
}