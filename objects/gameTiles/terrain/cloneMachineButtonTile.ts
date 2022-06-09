import { PlayerTile } from './../mob/playerTile';
import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';
import { MobService } from './../../../services/mob/mobService';
import { BallTile, BlobTile, BlockTile, BugTile, FireballTile, GliderTile, ParemeciumTile, TankTile, TeethTile, WalkerTile, BowlingBallTile } from './../../../objects/mobTile';

export class CloneMachineButtonTile implements TerrainTile {
  value = Constants.TERRAIN_CLONE_BUTTON;
  id = null;

  interactionFromPlayer(game: Game, id: string, x: number, y: number): void {
    this.spawnMobsFromNearbyCloneMachines(game, id, x, y);
  }

  interactionFromMob(game: Game, id: string, x: number, y: number): void {
    this.spawnMobsFromNearbyCloneMachines(game, id, x, y);
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

  canSpawnMobOnIt(direction: number): boolean {
    return true;
  }

  private spawnMobsFromNearbyCloneMachines(game: Game, id: string, x: number, y: number) {
    const cloneMachines = new Array<number[]>();
    for(let i = -2; i < 3; i++)
      for(let j = -2; j < 3; j++)
      {
        const searchX = (x + i + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        const searchY = (y + j + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        if(game.gameMap.getTerrainTile(searchX, searchY).value === Constants.TERRAIN_CLONE_MACHINE)
          cloneMachines.push([searchX, searchY]);
      }

    cloneMachines.forEach(coords => {
      const newCoords = coords;
      const mob = game.gameMap.getMobTile(coords[0], coords[1]);
      if (mob)
      {
        const direction = mob.direction;
        switch (direction)
        {
          case (Constants.DIRECTION_UP): newCoords[1] = (newCoords[1] - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case (Constants.DIRECTION_RIGHT): newCoords[0] = (newCoords[0] + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;; break;
          case (Constants.DIRECTION_DOWN): newCoords[1] = (newCoords[1] + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case (Constants.DIRECTION_LEFT): newCoords[0] = (newCoords[0] - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;; break;
        }
        if(game.gameMap.getTerrainTile(newCoords[0], newCoords[1]).canSpawnMobOnIt(direction))
        {
          var mobTile = game.gameMap.getMobTile(newCoords[0], newCoords[1]);
          if(mobTile instanceof PlayerTile)
            var playerTile = game.findPlayerTile(mobTile.id);
            MobService.kill(game, playerTile);
          if(game.gameMap.getMobTile(newCoords[0], newCoords[1]) === null)
          {
            let ownerId = null;
            if (game.findPlayer(id))
              ownerId = id;
            if (mob instanceof BallTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new BallTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof BlobTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new BlobTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof BlockTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new BlockTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof BugTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new BugTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof FireballTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new FireballTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof GliderTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new GliderTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof ParemeciumTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new ParemeciumTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof TankTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new TankTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof TeethTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new TeethTile(mob.direction), game.mobs, ownerId);
            else if (mob instanceof WalkerTile)
              game.gameMap.addMob(newCoords[0], newCoords[1], new WalkerTile(mob.direction), game.mobs, ownerId);
            game.gameMap.objectTiles[newCoords[0]][newCoords[1]]?.interactionFromMob(
              game, game.gameMap.getMobTile(newCoords[0], newCoords[1]).id, newCoords[0], newCoords[1]);
            if(game.gameMap.getMobTile(newCoords[0], newCoords[1]))
              game.gameMap.terrainTiles[newCoords[0]][newCoords[1]]?.interactionFromMob(
                game, game.gameMap.getMobTile(newCoords[0], newCoords[1]).id, newCoords[0], newCoords[1]);
          } else if (game.gameMap.getMobTile(newCoords[0], newCoords[1]) instanceof BowlingBallTile) {
            MobService.kill(game, game.gameMap.getMobTile(newCoords[0], newCoords[1]));
          }
        }
      }
    });
  }
}
