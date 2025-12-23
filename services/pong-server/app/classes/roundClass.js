import TournamentRoom from './tournamentRoomClass.js';

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
        let currentRoom = null

        if ((this.state === "waiting") && this.players) {
            for (let i = 0; i < this.players.length; i++) {
                if (!(i % 2)){
                    currentRoom = new TournamentRoom()
                    this.rooms.push(currentRoom);
                    currentRoom.on("done", () => {
                        this.counter++;
                        if (this.counter === this.rooms.length) {
                            this.state = "done";
                            this.emit("done");
                        }
                    })
                }
                currentRoom.addInvitee(this.players[i].id);
            }
            this.state = "ready";
        }
    }

    startRound() {
        this.prepareRound();
        if (this.ready) {
            for (let room of this.rooms) {
                room.invitePlayers();
            }
            this.state = "going";
        } else {
            console.log("Round not ready yet!!");
        }
    }

    getWinners() {
        const winners = [];
        if (this.state === "done") {
            for (let room of this.rooms) {
                if (room.getState() === "done") {
                    winners.push(room.getWinner());
                }
            }
            return (winners);
        }
        return (null);
    }

    toJSON() {
        const matches = [];

        for (let room of this.rooms) {
            matches.push(room.toJSON());
        }

        return ({
            id      : this.id,
            state   : this.state,
            matches : rooms,
        })
    }

}