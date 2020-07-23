import { Constants } from './../../constants/constants';
import { GameTile } from '../gameTile';

export class BlankTile implements GameTile {
  value = Constants.TERRAIN_FLOOR;
  playerId = null;
  solid = false;
}
