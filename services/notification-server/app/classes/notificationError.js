export default class NotificationError extends Error {

    constructor(code, reason) {
        super();
         
        this.code = code;
        this.reason = reason;
    }
}