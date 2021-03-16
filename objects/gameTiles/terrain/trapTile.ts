import { TerrainTile } from '../../terrainTile';
import { Constants } from '../../../constants/constants';
import { Game } from 'objects/game';

export class TrapTile implements TerrainTile {
  value = Constants.TERRAIN_TRAP;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return false;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    if(this.trapOpen(game))
      return [];
    return [
      Constants.DIRECTION_UP,
      Constants.DIRECTION_RIGHT,
      Constants.DIRECTION_DOWN,
      Constants.DIRECTION_LEFT
    ];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    if(this.trapOpen(game))
      return [];
    return [
      Constants.DIRECTION_UP,
      Constants.DIRECTION_RIGHT,
      Constants.DIRECTION_DOWN,
      Constants.DIRECTION_LEFT
    ];
  }

  private trapOpen(game: Game): boolean {
    for(let i = 0; i < game.gameMap.terrainTiles.length; i++)
      for(let j = 0; j < game.gameMap.terrainTiles[i].length; j++)
        if (game.gameMap.getTerrainTile(i, j).value === Constants.TERRAIN_TRAP_BUTTON &&
          game.gameMap.getMobTile(i, j) !== null)
          return true;
    return false;
  }

  canSpawnMobOnIt(direction: number): boolean {
    return true;
  }
}
