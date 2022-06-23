import { Constants } from '../constants/constants';

export class Coordinates
{
    x: number;
    y: number;
    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    left = () => { return new Coordinates((this.x - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE, this.y); }
    right = () => { return new Coordinates((this.x + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE, this.y); }
    down = () => { return new Coordinates(this.x, (this.y + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE); }
    up = () => { return new Coordinates(this.x, (this.y - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE); }
}