import { TerrainTile } from "../../terrainTile";
import { Game } from "objects/game";
import { Constants } from "../../../constants/constants";
import { MobService } from "./../../../services/mobService";
import {
  BallTile,
  BlobTile,
  BlockTile,
  BugTile,
  FireballTile,
  GliderTile,
  ParemeciumTile,
  TankTile,
  TeethTile,
  WalkerTile,
  BowlingBallTile,
  PlayerTile,
} from "./../../../objects/mobTile";
import { Coordinates } from '../../coordinates';

export class CloneMachineButtonTile implements TerrainTile {
  value = Constants.TERRAIN_CLONE_BUTTON;
  id = null;

  interactionFromPlayer(game: Game, id: string, coords: Coordinates): void {
    this.spawnMobsFromNearbyCloneMachines(game, id, coords);
  }

  interactionFromMob(game: Game, id: string, coords: Coordinates): void {
    this.spawnMobsFromNearbyCloneMachines(game, id, coords);
  }

  solid(game: Game, id: string): boolean {
    if (game.findPlayer(id)) return false;
    if (game.findMob(id)) return false;
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

  private spawnMobsFromNearbyCloneMachines(
    game: Game,
    id: string,
    coords: Coordinates
  ) {
    const cloneMachines = new Array<Coordinates>();
    for (let i = -2; i < 3; i++)
      for (let j = -2; j < 3; j++) {
        const searchX = (coords.x + i + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        const searchY = (coords.y + j + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        const searchCoords = new Coordinates(searchX, searchY);
        if (
          game.gameMap.getTerrainTile(searchCoords).value ===
          Constants.TERRAIN_CLONE_MACHINE
        )
          cloneMachines.push(searchCoords);
      }

    cloneMachines.forEach((coords) => {
      var newCoords = coords;
      const mob = game.gameMap.getMobTile(coords);
      if (mob) {
        const direction = mob.direction;
        switch (direction) {
          case Constants.DIRECTION_UP:
            newCoords = newCoords.up();
            break;
          case Constants.DIRECTION_RIGHT:
            newCoords = newCoords.right();
            break;
          case Constants.DIRECTION_DOWN:
            newCoords = newCoords.down();
            break;
          case Constants.DIRECTION_LEFT:
            newCoords = newCoords.left();
            break;
        }
        if (
          game.gameMap
            .getTerrainTile(newCoords)
            .canSpawnMobOnIt(direction)
        ) {
          var mobTile = game.gameMap.getMobTile(newCoords);
          if (mobTile instanceof PlayerTile) {
            var playerTile = game.findPlayerTile(mobTile.id);
            if (playerTile.id != id) MobService.kill(game, playerTile);
          }
          if (game.gameMap.getMobTile(newCoords) === null) {
            let ownerId = null;
            if (game.findPlayer(id)) ownerId = id;
            if (mob instanceof BallTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new BallTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof BlobTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new BlobTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof BlockTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new BlockTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof BugTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new BugTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof FireballTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new FireballTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof GliderTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new GliderTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof ParemeciumTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new ParemeciumTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof TankTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new TankTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof TeethTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new TeethTile(mob.direction),
                game.mobs,
                ownerId
              );
            else if (mob instanceof WalkerTile)
              game.gameMap.addMob(
                newCoords.x,
                newCoords.y,
                new WalkerTile(mob.direction),
                game.mobs,
                ownerId
              );
            game.gameMap.objectTiles[newCoords.x][
              newCoords.y
            ]?.interactionFromMob(
              game,
              game.gameMap.getMobTile(newCoords).id,
              newCoords
            );
            if (game.gameMap.getMobTile(newCoords))
              game.gameMap.terrainTiles[newCoords.x][
                newCoords.y
              ]?.interactionFromMob(
                game,
                game.gameMap.getMobTile(newCoords).id,
                newCoords
              );
          } else if (
            game.gameMap.getMobTile(newCoords) instanceof
            BowlingBallTile
          ) {
            MobService.kill(
              game,
              game.gameMap.getMobTile(newCoords)
            );
          }
        }
      }
    });
  }
}
