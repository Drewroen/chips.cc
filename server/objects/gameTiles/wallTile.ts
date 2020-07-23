import { GameTile } from "../gameTile";

export class WallTile implements GameTile {
  value: number = 3;
  playerId: string = null;
  solid: boolean = true;
}
