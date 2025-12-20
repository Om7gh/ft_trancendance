import Player from "./playerClass.js";

export default class Invitation {

    constructor(type, sender, receiver, room) {
        this.id         = uuid();
        this.type       = type;
        this.sender     = new Player(sender);
        this.receiver   = new Player(receiver);
        this.room       = room;
        this.sendTime   = Math.floor(Date.now() / 1000);
    }

    invited(id) {
        if (this.receiver.id === id)
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
            receiver    : this.receiver.toJSON(),
        })
    }
}
