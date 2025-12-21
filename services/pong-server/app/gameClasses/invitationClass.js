import Player from "./playerClass.js";
import {v4 as uuid} from "uuid"
export default class Invitation {

    constructor(type, sender, receiverId, room) {
        this.id         = uuid();
        this.type       = type;
        this.sender     = new Player(sender);
        this.receiverId = receiverId;
        this.room       = room;
        this.sendTime   = Math.floor(Date.now() / 1000);
    }

    invited(id) {
        if (this.receiverId === id)
            return true;
        return false;
    }

    expired() {
        if (60 < ((Math.floor(Date.now() / 1000)) - this.time))
            return (true);
        return (false);
    }

    getRoom() {
        return (this.room);
    }

    toJSON() {
        return ({
            id          : this.id,
            type        : this.type,
            sender      : this.sender.toJSON(),
            receiver    : this.receiverId,
        })
    }
}
