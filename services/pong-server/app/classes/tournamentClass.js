import { v4 as uuid} from 'uuid';
import Round from './roundClass.js'

export default class Tournament {

    constructor() {
        this.id             = uuid();
        this.state          = "waiting";

        this.currentRound   = null;
        this.winner         = null;

        this.players        = [];
        this.rounds         = [];
    }

    isPlayer(playerId) {
        for (let player of this.players) {
            if (player.id === playerId) {
                return (true);
            }
        }
        return (false);
    }

    addPlayer(player) {
        if (this.state === "waiting") {
            this.players.push(player);
            if (this.players.length === 4) {
                this.startTournament();
            }
        }
    }

    removePlayer(playerId) {
        if (this.state === "waiting") {
            this.players = this.players.filter((item) => item.id !== playerId);
        }
    }

    startTournament() {
        if (this.state === "waiting") {
            if (this.players.length === 4) {
                this.currentRound = new Round();
                this.rounds.push(this.currentRound);
                this.currentRound.setPlayers(this.players);
                this.currentRound.on("done", () => {
                    this.nextRound();
                });
                this.currentRound.on("error", () => {
                    this.emit("error");
                });
                this.currentRound.startRound();
            }
        }
        return (null);
    }

    nextRound() {
        const winners = this.currentRound.getWinners();

        if (1 < winners.length) {
            this.currentRound = new Round();
            this.rounds.push(this.currentRound);
            this.currentRound.setPlayers(winners);
            this.currentRound.on("done", () => {
                this.nextRound();
            });
            this.currentRound.on("error", () => {
                this.emit("error");
            });
            this.currentRound.startRound();
        } else if (winners.length === 1) {
            this.winner = winners[0];
            this.state = "done";
            this.emit("done");
        } else {
            this.emit("error");
        }
    }

    toJSON() {
        
        if (this.state === "waiting") {
            let players = [];
            
            for (let player of this.players) {
                this.players.push(player.toJSON());
            }
            
            return ({
                id: this.id,
                state: this.state,
                winner: this.winner,
                players: players,
            })
        }

        let rounds = [];
        
        for (let round of this.rounds) {
            rounds.push(round.toJSON());
        }

        return ({
            id: this.id,
            state: this.state,
            winner: this.winner,
            rounds: rounds,
        })
    }
}
