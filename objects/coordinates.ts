import { Constants } from '../constants/constants';

export class Coordinates
{
    public x: number;
    public y: number;
    private height: number;
    private width: number;

    constructor(x: number, y: number, width: number, height: number)
    {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }

    left = () => { return new Coordinates((this.x - 1 + this.width) % this.width, this.y, this.width, this.height); }
    right = () => { return new Coordinates((this.x + 1 + this.width) % this.width, this.y, this.width, this.height); }
    down = () => { return new Coordinates(this.x, (this.y + 1 + this.height) % this.height, this.width, this.height); }
    up = () => { return new Coordinates(this.x, (this.y - 1 + this.height) % this.height, this.width, this.height); }
}