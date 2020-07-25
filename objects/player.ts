import { Constants } from './../constants/constants';
export class Player {
    cooldown: number;
    id: string;
    name: string;
    score: number;
    alive: boolean;

    constructor(id: string, name: string) {
        this.cooldown = 1;
        this.id = id;
        this.name = name;
        this.score = 0;
        this.alive = true;
    }

    incrementCooldown(): void {
      this.cooldown--;
    }

    resetCoolDown(): void {
      this.cooldown = Constants.MOVEMENT_SPEED * 2;
    }

    incrementScore(): void {
      this.score++;
    }

    kill(): void {
      this.alive = false;
      this.score = Math.floor(this.score * .5);
    }
}
