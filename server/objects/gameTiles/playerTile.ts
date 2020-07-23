import { GameTile } from "../gameTile";

export class PlayerTile implements GameTile {
  value: number = 1;
  playerId: string = null;
  solid: boolean = true;

  constructor(id: string)
  {
    this.playerId = id;
  }
}
