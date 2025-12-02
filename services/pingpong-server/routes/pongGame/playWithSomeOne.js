export function waitForOpponent(reply, room, uid) {
    var counter         = 0;

    const waiter = () => {
        console.log("hello form waiter: ", counter);
        if (room.ready()) {
            const oid = room.getOpponentId(uid);
            
            if (!oid)
                reply.code(500).send();
            else
                reply.code(200).send(JSON.stringify({uid: uid, oid: oid, rid: room.id}))
        } else if (!room.ready() && (10 < counter)) {
            room.stopMatch();
            reply.code(204).send();
        } else {
            setTimeout(waiter, 1000);
            counter++;
        }
    };

    waiter();
}

function playWithSomeOneHandler(request, reply) {
    const uid       = request.query.uid;
    const player    = this.addToPlayerList(uid);

    if (!player) {
        reply.code(500).send();
        return;
    }

    if (player.inMatch()) {
        reply.code(409).send();
        return ;
    }

    const room = this.addPlayerToRoom(player);

    if (!room) {
        reply.code(500).send();
        return;
    }

    player.rooms.push(room);

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