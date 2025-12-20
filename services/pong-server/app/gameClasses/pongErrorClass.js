export default class PongError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    toJSON() {
        return ({
            reason      : this.message,
            errorCod    : this.errorCode,
        })
    }
}