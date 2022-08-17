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
  MobTile,
} from "./../../../objects/mobTile";
import { Coordinates } from '../../coordinates';
import { GameService } from '../../../services/gameService';

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
        const searchX = (coords.x + i + game.dimensions.width) % game.dimensions.width;
        const searchY = (coords.y + j + game.dimensions.height) % game.dimensions.height;
        const searchCoords = new Coordinates(searchX, searchY, game.dimensions.width, game.dimensions.height);
        if (
          game.getTerrainTile(searchCoords).value ===
          Constants.TERRAIN_CLONE_MACHINE
        )
          cloneMachines.push(searchCoords);
      }

    cloneMachines.forEach((coords) => {
      var newCoords = coords;
      const mob = game.getMobTile(coords);
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
          game
            .getTerrainTile(newCoords)
            .canSpawnMobOnIt(direction)
        ) {
          var mobTile = game.getMobTile(newCoords);
          if (mobTile instanceof PlayerTile) {
            var playerTile = game.findPlayerTile(mobTile.id);
            if (playerTile.id != id) MobService.kill(game, playerTile);
          }
          if (game.getMobTile(newCoords) === null) {
            let ownerId = null;
            if (game.findPlayer(id)) ownerId = id;

            var newMob: MobTile = null;
            if (mob instanceof BallTile)
              newMob = new BallTile(mob.direction);
            else if (mob instanceof BlobTile)
              newMob = new BlobTile(mob.direction);
            else if (mob instanceof BlockTile)
              newMob = new BlockTile(mob.direction);
            else if (mob instanceof BugTile)
              newMob = new BugTile(mob.direction);
            else if (mob instanceof FireballTile)
              newMob = new FireballTile(mob.direction);
            else if (mob instanceof GliderTile)
              newMob = new GliderTile(mob.direction);
            else if (mob instanceof ParemeciumTile)
              newMob = new ParemeciumTile(mob.direction);
            else if (mob instanceof TankTile)
              newMob = new TankTile(mob.direction);
            else if (mob instanceof TeethTile)
              newMob = new TeethTile(mob.direction);
            else if (mob instanceof WalkerTile)
              newMob = new WalkerTile(mob.direction);
            
            if (newMob != null)
              GameService.addMob(game, newCoords.x, newCoords.y, newMob, ownerId);

            game.tiles[newCoords.x][
              newCoords.y
            ].object?.interactionFromMob(
              game,
              game.getMobTile(newCoords).id,
              newCoords
            );
            if (game.getMobTile(newCoords))
              game.tiles[newCoords.x][
                newCoords.y
              ].terrain?.interactionFromMob(
                game,
                game.getMobTile(newCoords).id,
                newCoords
              );
          } else if (
            game.getMobTile(newCoords) instanceof
            BowlingBallTile
          ) {
            MobService.kill(
              game,
              game.getMobTile(newCoords)
            );
          }
        }
      }
    });
  }
}
