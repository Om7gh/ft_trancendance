import { v4 as uuid} from 'uuid';
import { EventEmitter } from 'events';

import Round from './roundClass.js';

export default class Tournament extends EventEmitter {

    constructor() {
        super();

        this.id             = uuid();
        this.state          = "waiting";

        this.currentRound   = null;
        this.winner         = null;

        this.participants   = [];
        this.rounds         = [];
    }

    isMember(userId) {
        for (let member of this.participants) {
            if (member.id === userId) {
                return (true);
            }
        }
        return (false);
    }

    addMember(user) {
        if (this.state === "waiting") {
            this.participants.push(user);
            if (this.participants.length === 4) {
                this.startTournament();
            }
        }
    }

    removeMember(userId) {
        if (this.isMember(userId)) {
            this.participants = this.participants.filter((member) => member.id !== userId);
        }
    }

    createNewRound(participants) {
        this.currentRound =  new Round(this);

        this.rounds.push(this.currentRound);

        this.currentRound.setParticipants(participants);

        this.currentRound.on("newRoom", (room) => {
            this.emit("newRoom", room);
        });

        this.currentRound.on("done", () => {
            this.nextRound();
        });

        this.currentRound.on("error", () => {
            this.state = "canceled";
            this.emit("done");
        });
    }

    startTournament() {
        if (this.state === "waiting") {
            if (this.participants.length === 4) {
                this.state = "going";
                this.createNewRound(this.participants);
                this.currentRound.startRound();
            }
        }
        return (null);
    }

    nextRound() {
        const winners = this.currentRound.getWinners();

        if (1 < winners.length) {
            this.createNewRound(winners)
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

        let rounds = [];
        
        for (let round of this.rounds) {
            rounds.push(round.toJSON());
        }

        return ({
            id: this.id,
            state: this.state,
            ...((this.state === "waiting") && {participants: this.participants}),
            ...((this.state !== "waiting") && {rounds: rounds}),
            ...(this.winner && {winner: this.winner}),
        })
    }
}
