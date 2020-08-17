import { TankTile } from './../mob/tankTile';
import { ToggleWallTile } from './toggleWallTile';
import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class TankToggleButtonTile implements TerrainTile {
  value = Constants.TERRAIN_TANK_TOGGLE_BUTTON;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    game.gameMap.mobTiles.forEach(row => {
      row.forEach(mobTile => {
        if (mobTile instanceof TankTile)
          mobTile.direction = (mobTile.direction + 2) % 4;
      });
    });
  }

  interactionFromMob(game: Game, id: string): void {
    game.gameMap.mobTiles.forEach(row => {
      row.forEach(mobTile => {
        if (mobTile instanceof TankTile)
          mobTile.direction = (mobTile.direction + 2) % 4;
      });
    });
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return false;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }
}
