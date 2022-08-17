import { Constants } from '../constants/constants';
import { Coordinates } from '../objects/coordinates';
import { Game } from '../objects/game';

export class GameMapHelper
{
    static isForceField(value: number): boolean {
        return (
          value === Constants.TERRAIN_FORCE_UP ||
          value === Constants.TERRAIN_FORCE_RIGHT ||
          value === Constants.TERRAIN_FORCE_DOWN ||
          value === Constants.TERRAIN_FORCE_LEFT
        );
      }

    static isRandomForceField(value: number): boolean {
        return value === Constants.TERRAIN_FORCE_RANDOM;
      }
    
    static isIce(value: number): boolean {
        return [
          Constants.TERRAIN_ICE,
          Constants.TERRAIN_ICE_CORNER_DOWN_LEFT,
          Constants.TERRAIN_ICE_CORNER_LEFT_UP,
          Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN,
          Constants.TERRAIN_ICE_CORNER_UP_RIGHT,
        ].includes(value);
      }

    static isMobOnCloneMachine(game: Game, id: string): boolean {
      const coords = game.findMobTileCoordinates(id);
      if (coords)
        return (
          game.getTerrainTile(coords).value ===
          Constants.TERRAIN_CLONE_MACHINE
        );
      return false;
    }

    static getTeleportLocations(game: Game): Coordinates[] {
      const teleportCoords = new Array<Coordinates>();
      for (let i = 0; i < game.tiles.length; i++)
        for (let j = 0; j < game.tiles[i].length; j++) {
          if (game.tiles[i][j].terrain.value === Constants.TERRAIN_TELEPORT)
            teleportCoords.push(new Coordinates(i, j, game.dimensions.width, game.dimensions.height));
        }
  
      return teleportCoords
        .sort(() => Math.random() - 0.5)
        .filter(
          (coords) => game.getMobTile(coords) === null
        );
    }
}