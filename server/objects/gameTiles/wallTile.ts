import { GameTile } from '../gameTile';

export class WallTile implements GameTile {
  value = 3;
  playerId: string = null;
  solid = true;
}
