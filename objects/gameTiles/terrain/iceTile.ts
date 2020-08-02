import { TerrainTile } from '../../terrainTile';
import { Constants } from '../../../constants/constants';
import { Game } from 'objects/game';

export class IceTile implements TerrainTile {
  value: string;
  id = null;

  constructor() {
    this.value = Constants.TERRAIN_ICE;
  }

  interactionFromPlayer(game: Game, id: string): void {
    game.findPlayer(id).slipCooldown = 0;
    game.findPlayer(id).cooldown = 0;
  }

  interactionFromMob(game: Game, id: string): void {
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return false;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [Constants.DIRECTION_UP, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_RIGHT];
  }
}
