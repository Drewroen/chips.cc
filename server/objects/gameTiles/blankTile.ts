import { GameTile } from "../gameTile";

export class BlankTile implements GameTile {
  value: number = 0;
  playerId: string = null;
  solid: boolean = false;
}
