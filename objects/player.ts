import { Constants } from './../constants/constants';

export class Player {
    attemptedMoveCooldown: number;
    cooldown: number;
    slipCooldown: number;
    id: string;
    name: string;
    score: number;
    alive: boolean;
    movement: Movement[];
    inventory: Inventory;
    winner: boolean;
    respawnTimer: number;
    playerHasQuit: boolean;

    constructor(id: string, name: string) {
        this.cooldown = 1;
        this.id = id;
        this.name = name;
        this.score = 0;
        this.alive = true;
        this.slipCooldown = null;
        this.movement = [];
        this.inventory = new Inventory();
        this.winner = false;
        this.respawnTimer = 0;
        this.playerHasQuit = false;
    }

    incrementCooldown(): void {
      this.attemptedMoveCooldown--;
      this.cooldown--;
      if(this.slipCooldown)
        this.slipCooldown--;
    }

    incrementRespawnTime(): void {
      this.respawnTimer--;
    }

    kill(): void {
      this.alive = false;
      this.score = Math.floor(this.score * Constants.DEATH_CHIP_MULTIPLIER);
      this.inventory = new Inventory();
      this.respawnTimer = Constants.GAME_FPS * 3;
      this.movement = [];
    }

    addKeypress(direction: number): void {
        this.movement = this.movement.concat(new Movement(direction));
    }

    removeMovement(direction: number): void {
      this.movement = this.movement.filter(move => move.direction !== direction);
    }

    keyEligibleForMovement(): boolean {
      return this.movement[0]?.timeHeld === 0 || this.movement[0]?.timeHeld >= (Constants.MOVEMENT_SPEED);
    }

    quit(): void {
      this.playerHasQuit = true;
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

export class Inventory {
  redKeys: number;
  yellowKeys: number;
  blueKeys: number;
  greenKey: boolean;
  flippers: boolean;
  forceBoots: boolean;
  fireBoots: boolean;
  iceSkates: boolean;
  bowlingBalls: number;
  whistles: number;

  constructor()
  {
    this.redKeys = 0;
    this.yellowKeys = 0;
    this.blueKeys = 0;
    this.greenKey = false;
    this.flippers = false;
    this.forceBoots = false;
    this.fireBoots = false;
    this.iceSkates = false;
    this.bowlingBalls = 0;
    this.whistles = 0;
  }
}
