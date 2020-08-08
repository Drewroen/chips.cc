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
    if ((coords && currentPlayer.cooldown <= 0) || moveType === Constants.MOVE_TYPE_AUTOMATIC) {
      const i = coords[0];
      const j = coords[1];
      if (moveType === Constants.MOVE_TYPE_AUTOMATIC ||
          !game.gameMap.getTerrainTile(i, j).getBlockedPlayerDirections(game, this.id).includes(direction))
      {
        this.direction = direction;
        this.setValueFromDirection();
        let newI = i;
        let newJ = j;
        switch (direction) {
          case Constants.DIRECTION_UP: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_DOWN: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_LEFT: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_RIGHT: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          default: break;
        }
        if (this.canPlayerMove(game, newI, newJ)) {
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
        else if (game.gameMap.getTerrainTile(i, j).value === Constants.TERRAIN_ICE)
        {
          direction = (direction + 2) % 4;
          newI = i;
          newJ = j;
          switch (direction) {
            case Constants.DIRECTION_UP: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_DOWN: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_LEFT: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_RIGHT: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            default: break;
          }
          if (this.canPlayerMove(game, newI, newJ)) {
            game.gameMap.getMobTile(newI, newJ)?.interactionFromPlayer(game, this.id, newI, newJ);
            game.gameMap.getObjectTile(newI, newJ)?.interactionFromPlayer(game, this.id, newI, newJ);
            game.gameMap.getTerrainTile(newI, newJ).interactionFromPlayer(game, this.id, newI, newJ);

            if(currentPlayer.alive)
            {
              game.gameMap.setMobTile(i, j, null);
              game.gameMap.setMobTile(newI, newJ, this);
              game.updatePlayerCooldown(this.id);
              this.direction = direction;
              this.setValueFromDirection();
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

  private canPlayerMove(game: Game, i: number, j: number) {
    if (game.gameMap.getTerrainTile(i, j).solid(game, this.id) ||
        game.gameMap.getObjectTile(i, j)?.solid(game, this.id) ||
        game.gameMap.getMobTile(i, j)?.solid(game, this.id)) {
      return false;
    }
    return true;
  }

  private setValueFromDirection() {
    switch(this.direction) {
      case (Constants.DIRECTION_UP): this.value = Constants.MOB_PLAYER_UP; break;
      case (Constants.DIRECTION_LEFT): this.value = Constants.MOB_PLAYER_LEFT; break;
      case (Constants.DIRECTION_DOWN): this.value = Constants.MOB_PLAYER_DOWN; break;
      case (Constants.DIRECTION_RIGHT): this.value = Constants.MOB_PLAYER_RIGHT; break;
    }
  }
}
