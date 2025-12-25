export default class User {
    constructor(user) {
        if (user) {
            this.id         = user.id;
            this.username   = user.username;
            this.avatar     = user.avatar;
        }
    }

    toJSON() {
        return ({
            id          : this.id,
            username    : this.username,
            avatar      : this.avatar,
        });
    }
}