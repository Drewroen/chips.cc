import { Constants } from './../constants/constants';

export class Player {
    cooldown: number;
    slipCooldown: number;
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
        this.slipCooldown = null;
    }

    incrementCooldown(): void {
      this.cooldown--;
      if(this.slipCooldown)
        this.slipCooldown--;
    }

    resetCoolDown(): void {
      this.cooldown = Constants.MOVEMENT_SPEED;
    }

    incrementScore(): void {
      this.score++;
    }

    kill(): void {
      this.alive = false;
      this.score = Math.floor(this.score * .5);
    }
}
