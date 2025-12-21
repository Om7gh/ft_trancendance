import Paddle from "./paddleClass.js";
import { EventEmitter } from 'events';

export default class Player extends EventEmitter {

    constructor(user, table) {
        super();

        this.id         = user.id;
        this.username   = user.username;
        this.avatar     = user.avatar;

        this.paddle     = new Paddle(table);
        this.socket     = null;
        this.points     = 0;
        
        this.joind      = false;
        this.leave      = false;
    }
    
    setSocket(socket) {
        console.log("++++try to set socket+++++")
        if (socket && !this.socket) {
            this.joind = true;
            this.socket = socket;
            console.log("++++set socket successfully+++++")

            socket.on('message', (message) => {
                let event = JSON.parse(message);
                if (!event)
                    return ;
                if (event.type === "move") {
                    if (event.data && (event.data.move === "up"))
                            this.paddle.moveUp();
                    else if (event.data && (event.data.move === "down"))
                            this.paddle.moveDown();
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

    setPaddleInTable(value) {
        this.paddle.setX(value);
    }

    setPoints(value) {
        this.points = value;
    }

    getPoints() {
        return this.points;
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
            username    : this.username,
            avatar      : this.avatar,
            points      : this.points,
        });
    }
}