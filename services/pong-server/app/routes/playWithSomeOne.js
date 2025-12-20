import headersSchema from '../schemas/headersSchema.js';

export function alreadyInMatch(roomList, userId) {
    for (let [id, room] of roomList) {
        if (room.isPlayer(userId)) {
            return (room);
        }
    }
    return (null);
}

export async function waitForOpponent(room) {
    let counter = null;
    let intervalId = null;

    return (new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
            if (room.getState() === "ready") {
                clearInterval(intervalId);
                resolve();
            } else if (60 < counter) {
                clearInterval(intervalId);
                reject({reason: "Error: Waiting for opponent too long!!", errorCode: "E203"});
            }
            counter++;
        }, 1000);
    }))
}

async function playWithSomeOneHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        reply.code(400);
        throw new Error("Invalid user passed to handler!!");
    }

    var   room  = alreadyInMatch(this.roomList, user.id);
        
    if (room && (room.getState() !== "done")) {
        reply.code(200).send(JSON.stringify(room.generateMatch()));
        return ;
    }
    
    room = this.addPlayerToRoom(user);
    
    await waitForOpponent(room);
    
    reply.send(JSON.stringify(room.generateMatch()));
}

export default function playWithSomeOne(fastify, options, done) {

    fastify.route({
        url     : '/pongGame/remote/someone',
        method  : 'GET',
        handler : playWithSomeOneHandler,
    })
    
    done();
}