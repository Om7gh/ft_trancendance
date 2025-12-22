import {v4 as uuid} from "uuid"
import User from "./userClass.js";

export default class Invitation {

    constructor(type, sender, receiver, room) {
        this.id         = uuid();
        this.type       = type;
        this.sender     = new User(sender);
        this.receiver   = new User(receiver);
        this.room       = room;
        this.expireTime = Math.floor(Date.now() / 1000) + 60000;
    }

    isInvited(id) {
        if (this.receiver.id === id)
            return true;
        return false;
    }

    expired() {
        if (this.expireTime < Math.floor(Date.now() / 1000))
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
            expireTime  : this.expireTime,
        })
    }
}
