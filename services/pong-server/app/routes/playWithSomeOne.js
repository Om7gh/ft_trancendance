import { PongError } from './pongClasses.js';

// export function waitForOpponent(reply, room, uid) {
//     var counter  = 0;

//     const waiter = () => {
//         if (room.full()) {
//             reply.code(200).send(JSON.stringify(room.generateMatch()));
//         } else if (!room.full() && (10 < counter)) {
//             reply.code(408).send({reason: "Error: from the match making", errorCode: "E203"});
//             room.stopMatch();
//             return ;
//         }
//         setTimeout(waiter, 1000);
//         counter++;
//     };

//     waiter();
// }

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
                reject();
            }
            counter++;
        }, 1000);
    }))
}

async function playWithSomeOneHandler(request, reply) {
    const player = this.addToPlayerList(request.user);

    if (!player) {
        reply.code(503);
        throw new Error("Error: from the match making", "E001");
    }

    if (player.inMatch()) {
        const oid = player.room.getOpponentId(player.id);
            
        if (oid) {
            reply.code(200).send(JSON.stringify(player.room.generateMatch()));
            return ;
        }
    }

    const room = this.addPlayerToRoom(player);

    if (!room) {
        reply.code(503);
        throw new Error("Error: from the match making", "E002");
    }

    player.room = room;

    room.on("done", () => {
        console.log(`room with id ${room.id} is done`);
        player.room = null;
    })

    await waitForOpponent(room)
        .then(() => {
            reply.code(200).send(JSON.stringify(room.generateMatch()));
        })
        .catch(() => {
            reply.code(408).send({reason: "Error: Waiting for opponent too long!!", errorCode: "E203"});
            room.stopMatch();
        });
}

export function playWithSomeOne(fastify, options, done) {

    fastify.route({
        url     : '/pongGame/remote/someone',
        method  : 'GET',
        handler : playWithSomeOneHandler,
    })
    
    done();
}