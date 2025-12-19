import { PongError, Invitation } from './pongClasses.js';

export async function waitForOpponent(room) {
    let counter = null;
    let intervalId = null;

    return (new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
            if (room.ready()) {
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
    var room = this.alreadyInMatch(user.id);
        
    if (room) {
        reply.code(200).send(JSON.stringify(room.generateMatch()));
        return ;
    }
    
    room = this.addPlayerToRoom(user);

    if (!room) {
        reply.code(503);
        throw new Error("Server overloaded, try later!!", "E002");
    }
    
    await waitForOpponent(room)
    
    reply.code(200).send(JSON.stringify(room.generateMatch()));
}

export default function playWithSomeOne(fastify, options, done) {

    fastify.route({
        url     : '/pongGame/remote/someone',
        method  : 'GET',
        handler : playWithSomeOneHandler,
    })
    
    done();
}