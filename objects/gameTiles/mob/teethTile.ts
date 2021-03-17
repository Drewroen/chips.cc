import { Constants } from '../../../constants/constants';
import { MobTile } from 'objects/mobTile';
import { Game } from 'objects/game';
import { PlayerTile } from './playerTile';
import { Mob } from 'objects/mob';

export class TeethTile implements MobTile {
  value;
  id: string;
  direction: number;
  speed = 4;

  constructor(direction: number, id?: string)
  {
    this.direction = direction % 4;

    this.setValueFromDirection();

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
          this.direction = directionAttempt;
          this.setValueFromDirection();
          if (this.canMobMove(game, newI, newJ, directionAttempt)) {
            this.direction = directionAttempt;
            this.setValueFromDirection();
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
    return this.findDirections(game);
  }

  kill(game: Game): void {
    game.mobs.map(mob => {if(mob.id === this.id) (mob.kill())});
    const coords = game.findMobTileCoordinates(this.id);
    game.gameMap.setMobTile(coords[0], coords[1], null);
  }

  interactionFromPlayer(game: Game, id: string): void{
    game.kill(id);
  }

  interactionFromMob(game: Game, id: string): void{
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return game.findMob(this.id).ownerId === id;
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

  private setValueFromDirection() {
    switch(this.direction) {
      case (Constants.DIRECTION_UP): this.value = Constants.MOB_TEETH_UP; break;
      case (Constants.DIRECTION_LEFT): this.value = Constants.MOB_TEETH_LEFT; break;
      case (Constants.DIRECTION_DOWN): this.value = Constants.MOB_TEETH_DOWN; break;
      case (Constants.DIRECTION_RIGHT): this.value = Constants.MOB_TEETH_RIGHT; break;
    }
  }

  private findDirections(game: Game): number[] {
    const teethCoords = game.findMobTileCoordinates(this.id);
    const teethX = teethCoords[0];
    const teethY = teethCoords[1];
    let closestCoords = null;
    let closestDistance;
    for (let i = 0; i < Constants.MAP_SIZE; i++)
      for (let j = 0; j < Constants.MAP_SIZE; j++)
      {
        if (game.gameMap.getMobTile(i, j) instanceof PlayerTile)
        {
          const xDistance = Math.min(teethX - i, Constants.MAP_SIZE - (teethX - i));
          const yDistance = Math.min(teethY - j, Constants.MAP_SIZE - (teethY - j));
          const playerDistanceFromMob = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
          if (closestCoords == null || playerDistanceFromMob < closestDistance)
          {
            closestCoords = [i, j];
            closestDistance = playerDistanceFromMob;
          }
        }
      }

    if (closestCoords !== null)
    {
      const closestPlayerX = closestCoords[0];
      const closestPlayerY = closestCoords[1];

      const finalXDistance = (teethX - closestPlayerX + Constants.MAP_SIZE) % Constants.MAP_SIZE;
      const finalYDistance = (teethY - closestPlayerY + Constants.MAP_SIZE) % Constants.MAP_SIZE;
      const halfMapSize = Constants.MAP_SIZE / 2;

      if (finalXDistance === 0)
      {
        if (finalYDistance < halfMapSize)
          return [Constants.DIRECTION_UP];
        else
          return [Constants.DIRECTION_DOWN];
      }
      else if (finalYDistance === 0)
      {
        if (finalXDistance < halfMapSize)
          return [Constants.DIRECTION_LEFT];
        else
          return [Constants.DIRECTION_RIGHT];
      }
      else if (finalXDistance < halfMapSize && finalYDistance < halfMapSize)
      {
        if (finalYDistance < finalXDistance)
          return [Constants.DIRECTION_LEFT, Constants.DIRECTION_UP];
        else
          return [Constants.DIRECTION_UP, Constants.DIRECTION_LEFT];
      }
      else if (finalXDistance < halfMapSize && finalYDistance > halfMapSize)
      {
        if (Constants.MAP_SIZE - finalYDistance < finalXDistance)
          return [Constants.DIRECTION_LEFT, Constants.DIRECTION_DOWN];
        else
          return [Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT];
      }
      else if (finalXDistance > halfMapSize && finalYDistance < halfMapSize)
      {
        if (finalYDistance < Constants.MAP_SIZE - finalXDistance)
          return [Constants.DIRECTION_RIGHT, Constants.DIRECTION_UP];
        else
          return [Constants.DIRECTION_UP, Constants.DIRECTION_RIGHT];
      }
      else if (finalXDistance > halfMapSize && finalYDistance > halfMapSize)
      {
        if (Constants.MAP_SIZE - finalYDistance < Constants.MAP_SIZE - finalXDistance)
          return [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN];
        else
          return [Constants.DIRECTION_DOWN, Constants.DIRECTION_RIGHT];
      }
    }
    return [];
  }
}
