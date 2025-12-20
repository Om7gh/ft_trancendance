export default class Paddle {
    constructor(table) {
        this.x                  = 0;
        this.y                  = ((table.height / 2) - 20);
        this.speed              = 5;
        this.width              = 10;
        this.height             = 80;
        this.color              = "black";
        this.table              = table;
    }

    setX(value) {
        this.x = value;
    }

    isInside(x, y) {
        if (x && y) {
            if (((this.x - (this.width / 2)) < x) && (x < (this.x + (this.width / 2))) && 
                (this.y < y) && (y < (this.y + this.height)))
               return true;
        }
        return false;
    }

    moveUp() {
        this.y = (0 < (this.y - this.speed)) ?
            (this.y - this.speed) : 0;
        return this.y;
    }

    moveDown() {
        this.y = ((this.y + this.height + this.speed) < this.table.height) ?
            (this.y + this.speed) : (this.table.height - this.height);
        return this.y;
    }

    toJSON() {
        return {
            x       : this.x,
            y       : this.y,
            width   : this.width,
            height  : this.height,
            color   : this.color,
        }
    }
}