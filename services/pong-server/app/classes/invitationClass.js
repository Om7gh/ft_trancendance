import {v4 as uuid} from "uuid"
import User from "./userClass.js";

export default class Invitation {

    constructor(type, sender, receiver, room, timeOut) {
        this.id             = uuid();
        this.type           = type;
        this.sender         = new User(sender);
        this.receiver       = new User(receiver);
        this.room           = room;
        this.expireTime     = (timeOut) ? (Math.floor(Date.now() / 1000) + timeOut) : null;
    }

    isInvited(id) {
        if (this.receiver.id === id)
            return true;
        return false;
    }

    expired() {
        if (this.expireTime < (Math.floor(Date.now() / 1000)))
            return (true);
        return (false);
    }

    getRoom() {
        return (this.room);
    }

    toJSON() {
        if (!this.receiver)
            return null;
        return {
            id         : this.id,
            type       : this.type,
            receiver   : this.receiver.toJSON(),
            expireTime : this.expireTime,
            ...(this.sender && { sender: this.sender.toJSON() }),
        };
    }

}
