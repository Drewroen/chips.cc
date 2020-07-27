import { TerrainTile } from '../../terrainTile';
import { Constants } from '../../../constants/constants';
import { Game } from 'objects/game';

export class ForceTile implements TerrainTile {
  value = Constants.TERRAIN_FORCE;
  id = null;
  direction: number;

  constructor(direction: number) {
    this.direction = direction;
  }

  interactionFromPlayer(game: Game, id: string): void {
    game.findPlayer(id).slipCooldown = 0;
    game.findPlayer(id).cooldown = 0;
  }

  interactionFromMob(game: Game, id: string): void {
    game.findMobTile(id).direction = this.direction;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return false;
    return true;
  }
}
