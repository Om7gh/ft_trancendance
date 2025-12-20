export default class Round extends EventEmitter {

    constructor() {
        this.id         = uuid();
        this.state      = "waiting";
        this.players    = null;
        this.rooms      = [];
        this.counter    = 0;
    }

    getState() {
        return (this.state);
    }

    setPlayers(players) {
        if (this.state === "waiting") {
            this.players = players;
        }
    }

    prepareRound() {
        if ((this.state === "waiting")) {
            for (let i = 0; i < this.players.length; i += 2) {
                const room = new TournamentRoom();
                room.on("done", () => {
                    this.counter++;
                    if (this.counter === this.rooms.length) {
                        this.state = "done";
                        this.emit("done");
                    }
                })
                this.rooms.push(room);
            }
            this.state === "ready";
        }
    }

    startRound() {
        let j = 0;

        this.prepareRound();
        for (let i = 0; i < this.players.length; i++) {
            this.rooms[j].addPlayer(this.players[i]);
            if (i % 2) {
                this.rooms[j].startMatch();
                j++;
            }
        }
        this.state = "going";
        return (null);
    }

    getWinners() {
        const winners = [];
        if (this.state === "done") {
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].getState() === "done") {
                    winners.push(this.rooms[i].getWinner());
                }
            }
            return (winners);
        }
        return (null);
    }

    toJSON() {
        const rooms = [];

        for (let i = 0; i < this.rooms.length; i++) {
            rooms.push(this.rooms[i].toJSON());
        }
        return ({
            id      : this.id,
            state   : this.state,
            matchs  : rooms,
        })
    }

}