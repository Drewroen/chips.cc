import { TerrainTile } from '../../terrainTile';
import { Constants } from '../../../constants/constants';
import { Game } from 'objects/game';

export class IceTile implements TerrainTile {
  value: string;
  id = null;

  constructor(value: string) {
    this.value = value;
  }

  interactionFromPlayer(game: Game, id: string): void {
    const player = game.findPlayerTile(id);
    switch (this.value)
    {
      case Constants.TERRAIN_ICE: return;
      case Constants.TERRAIN_ICE_CORNER_DOWN_LEFT:
        player.direction = player.direction === Constants.DIRECTION_RIGHT ?
          Constants.DIRECTION_DOWN :
          Constants.DIRECTION_LEFT;
        return;
      case Constants.TERRAIN_ICE_CORNER_LEFT_UP:
        player.direction = player.direction === Constants.DIRECTION_DOWN ?
          Constants.DIRECTION_LEFT :
          Constants.DIRECTION_UP;
        return;
      case Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN:
        player.direction = player.direction === Constants.DIRECTION_UP ?
          Constants.DIRECTION_RIGHT :
          Constants.DIRECTION_DOWN;
        return;
      case Constants.TERRAIN_ICE_CORNER_UP_RIGHT:
        player.direction = player.direction === Constants.DIRECTION_LEFT ?
          Constants.DIRECTION_UP :
          Constants.DIRECTION_RIGHT;
        return;

    }
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string, direction: number): boolean{
    switch(this.value)
    {
      case Constants.TERRAIN_ICE:
        return false;
      case Constants.TERRAIN_ICE_CORNER_DOWN_LEFT:
        return [Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT].includes(direction);
      case Constants.TERRAIN_ICE_CORNER_LEFT_UP:
        return [Constants.DIRECTION_UP, Constants.DIRECTION_LEFT].includes(direction);
      case Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN:
        return [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN].includes(direction);
      case Constants.TERRAIN_ICE_CORNER_UP_RIGHT:
        return [Constants.DIRECTION_RIGHT, Constants.DIRECTION_UP].includes(direction);
    }
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    if(game.findPlayer(id).inventory.iceSkates)
      return [];
    return [Constants.DIRECTION_UP, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_RIGHT];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }
}
