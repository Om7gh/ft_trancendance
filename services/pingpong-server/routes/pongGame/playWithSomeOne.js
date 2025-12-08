export function waitForOpponent(reply, room, uid) {
    var counter  = 0;

    const waiter = () => {
        if (room.state === "waiting") {
            if (room.full()) {
                const oid = room.getOpponentId(uid);
            
                if (!oid)
                    reply.code(500).send();
                else
                    reply.code(200).send(JSON.stringify({uid: uid, oid: oid, rid: room.id}))
            } else if (!room.full() && (10 < counter)) {
                reply.code(204).send();
                room.stopMatch();
            } else {
                setTimeout(waiter, 1000);
                counter++;
            }
        } else {
            reply.code(500).send();
        }
    };

    waiter();
}

function playWithSomeOneHandler(request, reply) {
    const uid       = request.query.uid;
    const player    = this.addToPlayerList(uid);

    if (!player) {
        reply.code(500).send();
        return ;
    }

    if (player.inMatch()) {
        const oid = player.room.getOpponentId(uid);
            
        if (!oid)
            reply.code(500).send();
        else
            reply.code(200).send(JSON.stringify({uid: uid, oid: oid, rid: player.room.id}))
        return ;
    }

    const room = this.addPlayerToRoom(player);

    if (!room) {
        reply.code(500).send();
        return ;
    }

    player.room = room;

    room.on("done", () => {
        console.log(`room with id ${room.id} is done`);
        player.room = null;
    })

    waitForOpponent(reply, room, uid);
}

export function playWithSomeOne(fastify, options, done) {

    fastify.route({
        url: '/pongGame/remote/someone',
        method: 'GET',
        handler: playWithSomeOneHandler,
    })
    
    done();
}