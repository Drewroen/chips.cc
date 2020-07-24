import { Constants } from './../../constants/constants';
import { GameTile } from '../gameTile';

export class WallTile implements GameTile {
  value = Constants.TERRAIN_WALL;
  id = null;
  solid = true;
}
