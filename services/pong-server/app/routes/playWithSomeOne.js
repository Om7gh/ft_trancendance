import { PongError } from './pongClasses.js';

export function waitForOpponent(reply, room, uid) {
    var counter  = 0;

    const waiter = () => {
        if (room.full()) {
            reply.code(200).send(JSON.stringify(room.generateMatch()));
        } else if (!room.full() && (10 < counter)) {
            reply.code(408).send({reason: "Error: from the match making", errorCode: "E203"});
            room.stopMatch();
            return ;
        }
        setTimeout(waiter, 1000);
        counter++;
    };

    waiter();
}

function playWithSomeOneHandler(request, reply) {
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

    waitForOpponent(reply, room, request.user.id);
}

export function playWithSomeOne(fastify, options, done) {

    fastify.route({
        url     : '/pongGame/remote/someone',
        method  : 'GET',
        handler : playWithSomeOneHandler,
    })
    
    done();
}