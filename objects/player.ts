import { Constants } from './../constants/constants';

export class Player {
    cooldown: number;
    slipCooldown: number;
    id: string;
    name: string;
    score: number;
    alive: boolean;
    movement: any[];

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
      if (this.movement.filter(move => move.direction === direction).length > 0)
      {
        this.movement.map(move => {
          if (move.direction === direction)
            move = {direction, enabled: true, cooldown: null};
        });
      }
      else
        this.movement = this.movement.concat([{direction, enabled: true, cooldown: null}]);
    }

    removeMovement(direction: number): void {
      if(this.movement.length === 1 && this.movement[0].direction === direction)
      {
        this.movement.map(move => {
          if (move.direction === direction)
            move.enabled = false;
            move.cooldown = Constants.MOVEMENT_SPEED / 4;
        });
      }
      else
        this.movement = this.movement.filter(move => move.direction !== direction);
    }

    incrementMovement(): void {
      this.movement = this.movement.filter(move => move.enabled === true || move.cooldown !== 0)
      this.movement.map(move => {
        if (move.enabled === false && move.cooldown > 0)
          move.cooldown--;
      });
    }
}
