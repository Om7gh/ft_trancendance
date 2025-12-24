import { v4 as uuid} from 'uuid';
import Round from './roundClass.js';
import { EventEmitter } from 'events';
import Player from './playerClass.js';

export default class Tournament extends EventEmitter {

    constructor() {
        super();

        this.id             = uuid();
        this.state          = "waiting";

        this.currentRound   = null;
        this.winner         = null;

        this.users          = [];
        this.rounds         = [];
    }

    isPlayer(userId) {
        for (let user of this.users) {
            if (user.id === userId) {
                return (true);
            }
        }
        return (false);
    }

    addPlayer(user) {
        if (this.state === "waiting") {
            this.users.push(user);
            if (this.users.length === 2) {
                this.startTournament();
            }
        }
    }

    removePlayer(userId) {
        if (this.state === "waiting") {
            this.users = this.users.filter((item) => item.id !== userId);
        }
    }

    startTournament() {
        if (this.state === "waiting") {
            if (this.users.length === 2) {
                this.state = "going";
                this.currentRound = new Round();
                this.rounds.push(this.currentRound);
                this.currentRound.setPlayers(this.users);
                this.currentRound.on("done", () => {
                    this.nextRound();
                });
                this.currentRound.on("error", () => {
                    this.state = "done";
                    this.emit("done");
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
                this.emit("done");
            });
            this.currentRound.startRound();
        } else if (winners.length === 1) {
            this.winner = winners[0];
            this.state = "done";
            this.emit("done");
        } else {
            this.state = "done";
            this.emit("done");
        }
    }

    toJSON() {
        
        if (this.state === "waiting") {
            return ({
                id: this.id,
                state: this.state,
                users: this.users,
            })
        }

        let rounds = [];
        
        for (let round of this.rounds) {
            rounds.push(round.toJSON());
        }

        return ({
            id: this.id,
            state: this.state,
            ...(this.winner && {winner: this.winner.toJSON()}),
            rounds: rounds,
        })
    }
}
