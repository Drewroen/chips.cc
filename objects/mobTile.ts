import { GameTile } from "./gameTile";
import { MobService } from "./../services/mobService";

export class MobTile implements GameTile {
  value: number;
  id: string;
  direction: number;
  speed: number;

  constructor(direction: number, id?: string) {
    this.direction = direction % 4;
    id
      ? (this.id = id)
      : (this.id =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15));
    MobService.setSpriteBasedOnDirection(this);
  }
}

export class WalkerTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
  }
}

export class TeethTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 4;
  }
}

export class TankTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
  }
}

export class ParemeciumTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
  }
}

export class GliderTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
  }
}

export class FireballTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
  }
}

export class BugTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
  }
}

export class BowlingBallTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
  }
}

export class BlockTile extends MobTile {
  lastHitTime: number;
  lastHitId: string;
  health: number;

  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
    this.lastHitTime = 0;
    this.lastHitId = null;
    this.health = 4;
  }
}

export class BlobTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 4;
  }
}

export class BallTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = 2;
  }
}

export class PlayerTile extends MobTile {
  constructor(direction: number, id?: string) {
    super(direction, id);
    this.speed = null;
  }
}
