export default class Ball {

    constructor(x, y) {
        this.x              = x;
        this.y              = y;
        this.direction      = 1;
        this.speed          = 5;
        this.radius         = 10;
        this.angle          = 5;
        this.lastHit        = "";
        this.color          = "orange";
    }

    generateRandomAngle() {
        return (((Math.random() * (190 - 170)) + 170) + ((0 < this.direction) ?  180 : 0));
    }

    reset() {
        this.x = 350;
        this.y = 200;
        this.speed = 7;
        this.lastHit = "";
        this.direction *= -1;
        this.angle = this.generateRandomAngle();
    }

    setAngle(angle) {
        if (angle < 0)
            this.angle = 360 + angle;
        else
            this.angle = angle;
    }

     addEffect(paddleCenterY) {
        if ((this.y < paddleCenterY) && (90 < this.angle) && (this.angle < 270))
            this.setAngle(this.angle + 2);
        else if ((this.y < paddleCenterY) && (this.angle < 90) || (270 < this.angle))
            this.setAngle(this.angle - 2);
        else if ((paddleCenterY < this.y) && (90 < this.angle) && (this.angle < 270))
            this.setAngle(this.angle - 2);
        else if ((paddleCenterY < this.y) && (this.angle < 90) || (270 < this.angle))
            this.setAngle(this.angle + 2);
    }

    isHitPaddle(paddle) {
        let angle = 0;
        let paddleCenterY = paddle.y + (paddle.height / 2);

        while (angle < 360) {
            let x = this.x + this.radius * Math.cos(angle * (Math.PI / 180));
            let y = this.y + this.radius * Math.sin(angle * (Math.PI / 180));

            if (paddle.isInside(x, y)) {
                if ((paddle.height / 4) < Math.abs(paddleCenterY - y))
                    this.addEffect(paddleCenterY);
                return true;
            }
            angle += 15;
        }
        return false;
    }
    
    getNextPosition(table, left_paddle, right_paddle) {
        if (((this.y - this.radius) <= 0) || (table.height <= (this.y + this.radius))) {
            this.setAngle(360 - this.angle);
            this.lastHit = "topOrBottom";
        } else if ((this.lastHit !== "right_paddle") && this.isHitPaddle(right_paddle)) {
            this.setAngle(180 - this.angle);
            this.lastHit = "right_paddle";
            this.speed += (this.speed < 15) ? 0.25 : 0;
        } else if ((this.lastHit !== "left_paddle") && this.isHitPaddle(left_paddle)) {
            this.setAngle(180 - this.angle);
            this.lastHit = "left_paddle";
            this.speed += (this.speed < 10) ? 0.25 : 0;
        }
        this.x += this.speed * Math.cos(this.angle * (Math.PI / 180))
        this.y += this.speed * Math.sin(this.angle * (Math.PI / 180))
    }

    toJSON() {
        return {
            x       : this.x,
            y       : this.y,
            radius  : this.radius,
            color   : this.color,
        }
    }
}