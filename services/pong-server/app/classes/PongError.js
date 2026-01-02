export default class PongError extends Error {

    constructor(code, reason) {
        super();
         
        this.code = code;
        this.reason = reason;
    }
}