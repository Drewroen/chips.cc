import { Constants } from './../../constants/constants';
import { GameTile } from '../gameTile';

export class WaterTile implements GameTile {
  value = Constants.TERRAIN_WATER;
  playerId = null;
  solid = false;
}
