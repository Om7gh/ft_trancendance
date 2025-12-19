import Paddle from "./paddleClass.js";
import { EventEmitter } from 'events';

export default class Player extends EventEmitter {

    constructor(user, table) {
        super();

        this.id         = user.id;
        this.name       = user.first_name;
        this.avatar     = user.avatar;

        this.paddle     = new Paddle(table);
        this.socket     = null;
        this.points     = 0;
        
        this.joind      = false;
        this.leave      = false;
    }
    
    setSocket(socket) {
        if (socket) {
            this.joind = true;
            this.socket = socket;

            socket.on('message', (message) => {
                let event = JSON.parse(message);
                if (event.type === "move") {
                    if (event.data) {
                        if (event.data.move === "up")
                            this.paddle.moveUp();
                        else if (event.data.move === "down")
                            this.paddle.moveDown();
                    }
                } else if (event.type === "leave") {
                    if (event.data === true) {
                        this.leave = true;
                        this.emit("leaveMatch");
                    }
                }
            })
            
            socket.on('close', () => {
                this.emit("socketClosed");
                this.socket = null;
            })
            
            socket.on('error', (err) => {
                this.log.error(err);
            });
        }
    }

    setPaddleSide(value) {
        this.x = value;
    }

    setPoints(value) {
        this.points = value;
    }

    incrementPoints() {
        this.points += 1;
    }

    isJoind() {
        return this.joind;
    }

    sendMessage(message) {
        if (this.socket) {
            this.socket.send(message);
        }
    }

    toJSON() {
        return ({
            id          : this.id,
            name        : this.name,
            avatar      : this.avatar,
            points      : this.points,
        });
    }
}