import { Constants } from '../../../constants/constants';
import { MobTile } from 'objects/mobTile';
import { Game } from 'objects/game';
import { Player } from 'objects/player';

export class PlayerTile implements MobTile {
  value = Constants.MOB_PLAYER_DOWN;
  id = null;
  direction = null;
  speed = null;

  constructor(id: string)
  {
    this.id = id;
  }

  move(game: Game): void {
    return;
  }

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    game.kill(this.id);
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return true;
    if(game.findMob(id))
      return false;
    return true;
  }

  movePlayer(game: Game, direction: number, moveType: number): void {
    const coords: number[] = game.findPlayerCoordinates(this.id);
    const currentPlayer: Player = game.findPlayer(this.id)
    currentPlayer.attemptedMoveCooldown = Constants.MOVEMENT_SPEED * 2;
    this.setValueFromDirection(direction);
    if ((coords && currentPlayer.cooldown <= 0) || moveType === Constants.MOVE_TYPE_AUTOMATIC) {
      const i = coords[0];
      const j = coords[1];
      if (moveType === Constants.MOVE_TYPE_AUTOMATIC ||
          !game.gameMap.getTerrainTile(i, j).getBlockedPlayerDirections(game, this.id).includes(direction))
      {
        this.direction = direction;
        this.setValueFromDirection(direction);
        let newI = i;
        let newJ = j;
        switch (direction) {
          case Constants.DIRECTION_UP: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_DOWN: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_LEFT: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_RIGHT: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          default: break;
        }
        if (this.canPlayerMove(game, newI, newJ, direction)) {
          game.gameMap.getMobTile(newI, newJ)?.interactionFromPlayer(game, this.id, newI, newJ);
          game.gameMap.getObjectTile(newI, newJ)?.interactionFromPlayer(game, this.id, newI, newJ);
          game.gameMap.getTerrainTile(newI, newJ).interactionFromPlayer(game, this.id, newI, newJ);

          if(currentPlayer.alive)
          {
            game.gameMap.setMobTile(i, j, null);
            game.gameMap.setMobTile(newI, newJ, this);
            game.updatePlayerCooldown(this.id);
          }
        }
        else if (this.isIce(game.gameMap.getTerrainTile(i, j).value))
        {
          direction = this.getWallBounceIceDirection(game.gameMap.getTerrainTile(i, j).value, direction);
          this.direction = direction;
          this.setValueFromDirection(direction);
          newI = i;
          newJ = j;
          switch (direction) {
            case Constants.DIRECTION_UP: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_DOWN: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_LEFT: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_RIGHT: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            default: break;
          }
          if (this.canPlayerMove(game, newI, newJ, direction)) {
            game.gameMap.getMobTile(newI, newJ)?.interactionFromPlayer(game, this.id, newI, newJ);
            game.gameMap.getObjectTile(newI, newJ)?.interactionFromPlayer(game, this.id, newI, newJ);
            game.gameMap.getTerrainTile(newI, newJ).interactionFromPlayer(game, this.id, newI, newJ);

            if(currentPlayer.alive)
            {
              game.gameMap.setMobTile(i, j, null);
              game.gameMap.setMobTile(newI, newJ, this);
              game.updatePlayerCooldown(this.id);
            }
          }
        }
      }
    }
  }

  kill(game: Game): void {
    game.players.map(player => {if(player.id === this.id) (player.kill())});
    const coords: number[] = game.findPlayerCoordinates(this.id);
    game.gameMap.setMobTile(coords[0], coords[1], null);
  }

  private canPlayerMove(game: Game, i: number, j: number, direction: number) {
    if (game.gameMap.getTerrainTile(i, j).solid(game, this.id, direction) ||
        game.gameMap.getObjectTile(i, j)?.solid(game, this.id, direction) ||
        game.gameMap.getMobTile(i, j)?.solid(game, this.id, direction)) {
      return false;
    }
    return true;
  }

  private setValueFromDirection(direction: number) {
    switch(direction) {
      case (Constants.DIRECTION_UP): this.value = Constants.MOB_PLAYER_UP; break;
      case (Constants.DIRECTION_LEFT): this.value = Constants.MOB_PLAYER_LEFT; break;
      case (Constants.DIRECTION_DOWN): this.value = Constants.MOB_PLAYER_DOWN; break;
      case (Constants.DIRECTION_RIGHT): this.value = Constants.MOB_PLAYER_RIGHT; break;
    }
  }

  private isIce(value: number) {
    return [
      Constants.TERRAIN_ICE,
      Constants.TERRAIN_ICE_CORNER_DOWN_LEFT,
      Constants.TERRAIN_ICE_CORNER_LEFT_UP,
      Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN,
      Constants.TERRAIN_ICE_CORNER_UP_RIGHT
    ].includes(value);
  }

  private getWallBounceIceDirection(value: number, direction: number): number {
    switch(value)
    {
      case Constants.TERRAIN_ICE:
        return (direction + 2) % 4;
      case Constants.TERRAIN_ICE_CORNER_DOWN_LEFT:
        return direction === Constants.DIRECTION_DOWN ?
          Constants.DIRECTION_LEFT :
          Constants.DIRECTION_DOWN;
      case Constants.TERRAIN_ICE_CORNER_LEFT_UP:
        return direction === Constants.DIRECTION_LEFT ?
          Constants.DIRECTION_UP :
          Constants.DIRECTION_LEFT;
      case Constants.TERRAIN_ICE_CORNER_UP_RIGHT:
        return direction === Constants.DIRECTION_UP ?
          Constants.DIRECTION_RIGHT :
          Constants.DIRECTION_UP;
      case Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN:
        return direction === Constants.DIRECTION_RIGHT ?
          Constants.DIRECTION_DOWN :
          Constants.DIRECTION_RIGHT;
    }
  }
}
