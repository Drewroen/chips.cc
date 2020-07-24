import { TerrainTile } from './../terrainTile';
import { Constants } from './../../constants/constants';

export class BlankTile implements TerrainTile {
  value = Constants.TERRAIN_FLOOR;
  id = null;
  solid = false;
}
