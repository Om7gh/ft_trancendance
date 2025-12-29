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

        this.members        = [];
        this.rounds         = [];
    }

    isMember(userId) {
        for (let member of this.members) {
            if (member.id === userId) {
                return (true);
            }
        }
        return (false);
    }

    addMember(user) {
        if (this.state === "waiting" && !this.isMember(user.id)) {
            this.participants.push(user);
            if (this.participants.length === 2) {
                this.startTournament();
            }
        }
    }

    removeMember(userId) {
        this.members = this.members.filter((member) => member.id !== userId);
    }

    createNewRound(members) {
        this.currentRound =  new Round(this);

        this.rounds.push(this.currentRound);

        this.currentRound.setMembers(members);

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

    extractMembersIds() {
        const ids = [];

        for (let member of this.members) {
            if (member) {
                ids.push(member.id);
            }
        }
        return (ids);
    }

    startTournament() {
        if (this.state === "waiting") {
            if (this.members.length === 2) {
                this.state = "going";
                this.createNewRound(this.extractMembersIds());
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

    stringifyRounds() {
        const rounds = [];

        for (let round of this.rounds) {
            if (round) {
                rounds.push(round.toJSON());
            }
        }
        return rounds;
    }

    toJSON() {
        const rounds = this.stringifyRounds();
        
        return ({
            id: this.id,
            state: this.state,
            ...((this.state === "waiting") && {members: this.members}),
            ...((this.state !== "waiting") && {rounds: rounds}),
            ...(this.winner && {winner: this.winner}),
        })
    }
}
