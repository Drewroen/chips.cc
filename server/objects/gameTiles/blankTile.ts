import { GameTile } from '../gameTile';

export class BlankTile implements GameTile {
  value = 0;
  playerId: string = null;
  solid = false;
}
