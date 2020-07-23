import { GameTile } from '../gameTile';

export class PlayerTile implements GameTile {
  value = 1;
  playerId: string = null;
  solid = true;

  constructor(id: string)
  {
    this.playerId = id;
  }
}
