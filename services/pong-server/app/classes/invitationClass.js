import { v4 as uuid} from 'uuid';
import { EventEmitter } from 'events';

export default class Invitation extends EventEmitter {

    constructor(senderId, inviteeId) {
        super();
        
        this.id         = uuid();
        this.state      = "waiting";
        this.senderId   = senderId;
        this.inviteeId  = inviteeId;
    }

    isInvited(id) {
        return (id === this.inviteeId);
    }

    waitForInvitee() {
        let counter = 0;

        const intervalId = setInterval(() => {
            if (this.state === "accepted") {
                clearInterval(intervalId);
            } else if (60 < counter) {
                clearInterval(intervalId);
                this.emit("done");
            }
        }, 1000);
    }

    accepted() {
        this.state = "accepted";
        this.emit("done");
    }

    isAlreadyInvited(inviteeId) {
        if (this.inviteeId === inviteeId)
            return true;
        false;
    }

}