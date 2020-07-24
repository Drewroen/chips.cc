import { GameTile } from './gameTile';
import { GameMap } from './gameMap';

export interface TerrainTile extends GameTile{
  solid: boolean;
}
