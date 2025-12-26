import { v4 as uuid} from 'uuid'
import { EventEmitter } from 'events';
import GenericRoom from './genericRoom.js';


export default class Round extends EventEmitter {

    constructor() {
        super();

        this.id             = uuid();
        this.state          = "waiting";
        this.participants   = null;
        this.rooms          = [];
        this.counter        = 0;
    }

    getState() {
        return (this.state);
    }

    setParticipants(participants) {
        if (this.state === "waiting") {
            this.participants = participants;
        }
    }

    prepareRound() {
        let currentRoom = null

        if ((this.state === "waiting") && this.participants) {
            for (let i = 0; i < this.participants.length; i++) {
                if ((i % 2) === 0) {
                    currentRoom = new GenericRoom();
                    currentRoom.type = "tournament";
                    this.rooms.push(currentRoom);

                    currentRoom.on("done", () => {
                        this.counter += 1;
                        if (this.counter === this.rooms.length) {
                            this.state = "done";
                            this.emit("done");
                        }
                    })

                    currentRoom.on("error", () => {
                        this.state = "canceled";
                        this.emit("error");
                    })

                    this.emit("newRoom", currentRoom);
                }
                currentRoom.addMember(this.participants[i]);
            }
            this.state = "ready";
        }
    }

    startRound() {
        this.prepareRound();
        if (this.state === "ready") {
            this.state = "going";
            for (let room of this.rooms) {
                room.inviteMembers();
            }
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
            matches : matches,
        })
    }

}