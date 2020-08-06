import { Constants } from './../constants/constants';

export class Player {
    cooldown: number;
    slipCooldown: number;
    id: string;
    name: string;
    score: number;
    alive: boolean;
    movement: Movement[];

    constructor(id: string, name: string) {
        this.cooldown = 1;
        this.id = id;
        this.name = name;
        this.score = 0;
        this.alive = true;
        this.slipCooldown = null;
        this.movement = [];
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

    addMovement(direction: number): void {
      this.movement = this.movement.concat(new Movement(direction));
    }

    removeMovement(direction: number): void {
      this.movement = this.movement.filter(move => move.direction !== direction);
    }

    keyEligibleForMovement(): boolean {
      return this.movement[0]?.timeHeld === 0 || this.movement[0]?.timeHeld >= (Constants.MOVEMENT_SPEED);
    }
}

export class Movement {
  direction: number;
  timeHeld: number;

  constructor(direction: number)
  {
    this.direction = direction;
    this.timeHeld = 0;
  }
}
