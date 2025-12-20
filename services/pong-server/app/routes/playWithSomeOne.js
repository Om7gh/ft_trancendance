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
                const error = new Error("Waiting for opponent too long!!");
                error.statusCode = 408;
                reject(error);
            }
            counter++;
        }, 1000);
    }))
}

async function playWithSomeOneHandler(request, reply) {
    const user  = request.user;
    const state = this.validateUser(user);

    if (!state) {
        const error = new Error("Invalid user passed to handler!!")
        error.statusCode = 400;
        throw error;
    }

    var   room  = alreadyInMatch(this.roomList, user.id);
        
    if (room && (room.getState() !== "done")) {
        reply.send(JSON.stringify(room.generateMatch()));
        return ;
    }
    
    room = this.addPlayerToRoom(user);
    
    await waitForOpponent(room);
    
    reply.send(JSON.stringify(room.generateMatch()));
}

export default async function playWithSomeOne(fastify, options) {

    fastify.route({
        url     : '/pongGame/remote/someone',
        method  : 'GET',
        handler : playWithSomeOneHandler,
    })
}