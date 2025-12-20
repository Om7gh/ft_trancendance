export class Table {
    context             : CanvasRenderingContext2D | null;
    width               : number;
    height              : number;

    constructor(){
        this.context    = null;
        this.width      = 0;
        this.height     = 0;
    }
    
    setContext(context: CanvasRenderingContext2D) {
        this.context    = context;
    }

    setContextDimensions(canvas: HTMLCanvasElement) {
        this.width      = canvas.width;
        this.height     = canvas.height;
    }

    clearContext() {
        if (this.context) {
            this.context.clearRect(0, 0, this.width, this.height);
        }
    }

    drawNewFrame(ball: Ball, left_paddle: Paddle, right_paddle: Paddle) {
        this.clearContext();
        left_paddle.draw(this);
        right_paddle.draw(this);
        ball.draw(this);
    }
}

export class Paddle {
    x                   : number;
    y                   : number;
    width               : number;
    height              : number;
    speed               : number;
    color               : string;

    constructor(x: number, y: number, color: string) {
        this.x          = x;
        this.y          = y;
        this.width      = 10;
        this.height     = 80;
        this.speed      = 6;
        this.color      = color;
    }

    isInside(x: number, y: number) {
        if (x && y) {
            if (((this.x - (this.width / 2)) < x) && (x < (this.x + (this.width / 2))) && 
                (this.y < y) && (y < (this.y + this.height)))
               return true;
        }
        return false;
    }

    draw(table: Table) {
        if (table && table.context) {
            table.context.beginPath();
            table.context.strokeStyle = this.color;
            table.context.lineWidth = this.width;
            table.context.moveTo(this.x, this.y);
            table.context.lineTo(this.x, (this.y + this.height));
            table.context.closePath();
            table.context.stroke();
        }
    }

    moveUp() {
        this.y = (0 < (this.y - this.speed)) ?
            (this.y - this.speed) : 0;
        return this.y;
    }

    moveDown(table: Table) {
        if (table) {
            this.y = ((this.y + this.height + this.speed) < table.height) ?
               (this.y + this.speed) : (table.height - this.height);
            return this.y;
        }
    }
}

export class Ball {
    x                    : number;
    y                    : number;
    angle                : number;
    speed                : number;
    radius               : number;
    lastHit              : string;
    direction            : number;
    color                : string;

    constructor(x: number, y: number, color: string) {
        this.x           = x;
        this.y           = y;
        this.angle       = 0;
        this.speed       = 5;
        this.radius      = 15;
        this.lastHit     = "";
        this.direction   = 1;
        this.color       = color;
    }

    generateRandomAngle() {
        return (((Math.random() * (190 - 170)) + 170) + ((0 < this.direction) ?  180 : 0));
    }

    reset() {
        this.x = 350;
        this.y = 200;
        this.speed = 5;
        this.lastHit = "";
        this.angle = this.generateRandomAngle();
    }

    setAngle(angle: number) {
        if (angle < 0)
            this.angle = 360 + angle;
        else
            this.angle = angle;
    }

    draw(table: Table) {
        if (table && table.context) {
            table.context.beginPath();
            table.context.fillStyle = this.color;
            table.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            table.context.fill();
        }
    }

    addEffect(paddleCenterY: number) {
        if (this.y < paddleCenterY) {
            if ((90 < this.angle) && (this.angle < 270))
                this.setAngle(this.angle + 2);
            else if ((this.angle < 90) || (270 < this.angle))
                this.setAngle(this.angle - 2);
        } else if (paddleCenterY < this.y) {
            if ((90 < this.angle) && (this.angle < 270))
                this.setAngle(this.angle - 2);
            else if ((this.angle < 90) || (270 < this.angle))
                this.setAngle(this.angle + 2);
        }
    }

    isHitPaddle(paddle: Paddle) {
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

    calculateReflectAngle(paddle: Paddle) {
        const x_paddleCenter = paddle.x + (paddle.width / 2);
        const y_paddleCenter = paddle.y + (paddle.height / 2);
        const adjacent       = this.x - x_paddleCenter;
        const opposite       = this.y - y_paddleCenter;
        const angle          = (Math.atan(opposite / adjacent) * (180 / Math.PI) + 180);

        this.setAngle(this.angle + angle);
    }
    
    getNextPosition(table: Table, left_paddle: Paddle, right_paddle: Paddle) {
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
}

export class Events {
    w         : false | true;
    s         : false | true;
    arrowup   : false | true;
    arrowdown : false | true;

    constructor() {
        this.s          = false;
        this.w          = false;
        this.arrowup    = false;
        this.arrowdown  = false;
    }
}