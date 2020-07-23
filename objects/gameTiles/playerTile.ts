import { Constants } from './../../constants/constants';
import { GameTile } from '../gameTile';

export class PlayerTile implements GameTile {
  value = Constants.MOB_PLAYER;
  playerId = null;
  solid = true;

  constructor(id: string)
  {
    this.playerId = id;
  }
}
