import { Constants } from '../../../constants/constants';
import { MobTile } from 'objects/mobTile';
import { Game } from 'objects/game';
import { Mob } from 'objects/mob';
import { DirtTile } from '../terrain/dirtTile';

export class BlockTile implements MobTile {
  value;
  id: string;
  direction: number;
  speed = 2;
  health = 3;
  lastHitTime = 0;
  lastHitId: string;

  constructor(direction: number, id?: string)
  {
    this.value = Constants.MOB_BLOCK;
    this.direction = direction;
    id ? this.id = id : this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  move(game: Game): void {
    const coords: number[] = game.findMobTileCoordinates(this.id);
    const currentMob: Mob = game.findMob(this.id);
    if (coords) {
      const i = coords[0];
      const j = coords[1];

      const preferredDirections = this.getPreferredDirections(game);
      for(const directionAttempt of preferredDirections)
      {
        if (!game.gameMap.getTerrainTile(i, j).getBlockedMobDirections(game, this.id).includes(directionAttempt))
        {
          let newI = i;
          let newJ = j;
          switch (directionAttempt) {
            case Constants.DIRECTION_UP: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_DOWN: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_LEFT: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.DIRECTION_RIGHT: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            default: break;
          }
          if (this.canMobMove(game, newI, newJ, directionAttempt)) {
            this.direction = directionAttempt;
            game.gameMap.getTerrainTile(newI, newJ).interactionFromMob(game, this.id, newI, newJ);
            if(game.findMob(this.id).alive)
              game.gameMap.getObjectTile(newI, newJ)?.interactionFromMob(game, this.id, newI, newJ);
            if(game.findMob(this.id).alive)
              game.gameMap.getMobTile(newI, newJ)?.interactionFromMob(game, this.id, newI, newJ);
            if (currentMob.alive)
            {
              game.gameMap.setMobTile(i, j, null);
              game.gameMap.setMobTile(newI, newJ, this);
            }
            return;
          }
        }
      }
    }
    this.direction = null;
  }

  private getPreferredDirections(game: Game): number[] {
    const coords = game.findMobTileCoordinates(this.id);
    if (game.isForceField(game.gameMap.getTerrainTile(coords[0], coords[1]).value))
      return [this.direction];
    else if (game.isRandomForceField(game.gameMap.getTerrainTile(coords[0], coords[1]).value))
      return [Math.floor(Math.random() * 4)];
    else if (game.gameMap.getTerrainTile(coords[0], coords[1]).value === Constants.TERRAIN_TELEPORT)
      return [this.direction];
    if (game.isIce(game.gameMap.getTerrainTile(coords[0], coords[1]).value))
    {
      switch(game.gameMap.getTerrainTile(coords[0], coords[1]).value)
      {
        case Constants.TERRAIN_ICE:
          return [this.direction, (this.direction + 2) % 4];
        case Constants.TERRAIN_ICE_CORNER_DOWN_LEFT:
          return this.direction === Constants.DIRECTION_UP ?
            [Constants.DIRECTION_LEFT, Constants.DIRECTION_DOWN] :
            [Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT];
        case Constants.TERRAIN_ICE_CORNER_LEFT_UP:
          return this.direction === Constants.DIRECTION_RIGHT ?
            [Constants.DIRECTION_UP, Constants.DIRECTION_LEFT] :
            [Constants.DIRECTION_LEFT, Constants.DIRECTION_UP];
        case Constants.TERRAIN_ICE_CORNER_UP_RIGHT:
          return this.direction === Constants.DIRECTION_DOWN ?
            [Constants.DIRECTION_RIGHT, Constants.DIRECTION_UP] :
            [Constants.DIRECTION_UP, Constants.DIRECTION_RIGHT];
        case Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN:
          return this.direction === Constants.DIRECTION_LEFT ?
            [Constants.DIRECTION_DOWN, Constants.DIRECTION_RIGHT] :
            [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN];
      }
    }
    if (this.direction !== null)
      return [this.direction];
    return [];
  }

  kill(game: Game): void {
    game.mobs.map(mob => {if(mob.id === this.id) (mob.kill())});
    const coords = game.findMobTileCoordinates(this.id);
    game.gameMap.setMobTile(coords[0], coords[1], null);
  }

  interactionFromPlayer(game: Game, id: string): void{
    return;
  }

  interactionFromMob(game: Game, id: string): void{
    return;
  }

  solid(game: Game, id: string, direction: number): boolean{
    if(game.findPlayer(id))
    {
      const coords = game.findMobTileCoordinates(this.id);
      this.direction = direction;
      this.move(game);
      const newCoords = game.findMobTileCoordinates(this.id);
      if (coords && newCoords) {
        if (coords[0] === newCoords[0] && coords[1] === newCoords[1]) {
          if(this.lastHitTime <= 0 || this.lastHitId !== id)
          {
            this.health--;
            this.lastHitId = id;
            this.lastHitTime = Constants.MOVEMENT_SPEED * 2;
            if (this.health < 3) {
              this.value = Constants.MOB_BLOCK_BROKEN;
            }
            if (this.health === 0) {
              game.gameMap.getMobTile(coords[0], coords[1]).kill(game);
              if(game.gameMap.getTerrainTile(coords[0], coords[1]).value === Constants.TERRAIN_FLOOR)
              {
                game.gameMap.setTerrainTile(coords[0], coords[1], new DirtTile());
                game.updatePlayerCooldown(id);
              }

            }
          }
          return true;
        }
        return false;
      }
    }
    if(game.findMobTile(id).value === Constants.MOB_BOWLING_BALL)
      return false;
    if(game.findMob(id))
      return true;
    return true;
  }

  private canMobMove(game: Game, i: number, j: number, direction: number) {
    if (game.gameMap.getTerrainTile(i, j).solid(game, this.id, direction) ||
        game.gameMap.getObjectTile(i, j)?.solid(game, this.id, direction) ||
        game.gameMap.getMobTile(i, j)?.solid(game, this.id, direction)) {
      return false;
    }
    return true;
  }
}
