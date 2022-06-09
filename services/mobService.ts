import { Constants } from "./../constants/constants";
import { Game } from "./../objects/game";
import {
  MobTile,
  BallTile,
  FireballTile,
  BlobTile,
  BlockTile,
  BowlingBallTile,
  BugTile,
  GliderTile,
  ParemeciumTile,
  TankTile,
  TeethTile,
  WalkerTile,
  PlayerTile,
} from "./../objects/mobTile";
import { DirtTile } from "./../objects/gameTiles/terrain/dirtTile";

export class MobService {
  static move(game: Game, mobTile: MobTile): void {
    const coords = game.findMobTileCoordinates(mobTile.id);
    const mob = game.findMob(mobTile.id);

    if (coords) {
      const x = coords[0];
      const y = coords[1];

      const preferredDirections = this.getPreferredDirections(game, mobTile);
      for (const directionAttempt of preferredDirections) {
        if (
          !game.gameMap
            .getTerrainTile(x, y)
            .getBlockedMobDirections(game, mobTile.id)
            .includes(directionAttempt)
        ) {
          let newX = x;
          let newY = y;
          switch (directionAttempt) {
            case Constants.DIRECTION_UP:
              newY = (y - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
              break;
            case Constants.DIRECTION_DOWN:
              newY = (y + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
              break;
            case Constants.DIRECTION_LEFT:
              newX = (x - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
              break;
            case Constants.DIRECTION_RIGHT:
              newX = (x + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
              break;
            default:
              break;
          }
          if (mobTile instanceof TankTile || mobTile instanceof TeethTile) {
            mobTile.direction = directionAttempt;
            this.setSpriteBasedOnDirection(mobTile);
          }
          if (
            this.mobCanMoveToCoordinates(
              game,
              mobTile,
              newX,
              newY,
              directionAttempt
            )
          ) {
            mobTile.direction = directionAttempt;
            this.setSpriteBasedOnDirection(mobTile);
            game.gameMap
              .getTerrainTile(newX, newY)
              .interactionFromMob(game, mob.id, newX, newY);
            if (game.findMob(mob.id).alive)
              game.gameMap
                .getObjectTile(newX, newY)
                ?.interactionFromMob(game, mob.id, newX, newY);
            if (game.findMob(mob.id).alive) {
              if (mobTile instanceof BowlingBallTile) {
                if (game.gameMap.getMobTile(newX, newY)) {
                  this.kill(game, game.gameMap.getMobTile(newX, newY));
                  this.kill(game, mobTile);
                }
              } else
                this.interactionFromMob(
                  game,
                  mob.id,
                  game.gameMap.getMobTile(newX, newY)
                );
            }
            if (mob.alive) {
              game.gameMap.setMobTile(x, y, null);
              game.gameMap.setMobTile(newX, newY, mobTile);
            }
            return;
          }
        }
      }
      if (mobTile instanceof BowlingBallTile) this.kill(game, mobTile);
    }

    if (mobTile instanceof BlockTile) mobTile.direction = null;
  }

  private static getPreferredDirections(
    game: Game,
    mobTile: MobTile
  ): number[] {
    const coords = game.findMobTileCoordinates(mobTile.id);
    var direction = mobTile.direction;
    if (
      game.isForceField(game.gameMap.getTerrainTile(coords[0], coords[1]).value)
    )
      return [direction];
    else if (
      game.isRandomForceField(
        game.gameMap.getTerrainTile(coords[0], coords[1]).value
      )
    )
      return [Math.floor(Math.random() * 4)];
    else if (
      game.gameMap.getTerrainTile(coords[0], coords[1]).value ===
      Constants.TERRAIN_TELEPORT
    )
      return [direction];
    else if (
      game.isIce(game.gameMap.getTerrainTile(coords[0], coords[1]).value)
    ) {
      switch (game.gameMap.getTerrainTile(coords[0], coords[1]).value) {
        case Constants.TERRAIN_ICE:
          return [direction, (direction + 2) % 4];
        case Constants.TERRAIN_ICE_CORNER_DOWN_LEFT:
          return direction === Constants.DIRECTION_UP
            ? [Constants.DIRECTION_LEFT, Constants.DIRECTION_DOWN]
            : [Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT];
        case Constants.TERRAIN_ICE_CORNER_LEFT_UP:
          return direction === Constants.DIRECTION_RIGHT
            ? [Constants.DIRECTION_UP, Constants.DIRECTION_LEFT]
            : [Constants.DIRECTION_LEFT, Constants.DIRECTION_UP];
        case Constants.TERRAIN_ICE_CORNER_UP_RIGHT:
          return direction === Constants.DIRECTION_DOWN
            ? [Constants.DIRECTION_RIGHT, Constants.DIRECTION_UP]
            : [Constants.DIRECTION_UP, Constants.DIRECTION_RIGHT];
        case Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN:
          return direction === Constants.DIRECTION_LEFT
            ? [Constants.DIRECTION_DOWN, Constants.DIRECTION_RIGHT]
            : [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN];
      }
    } else {
      if (mobTile instanceof BugTile)
        return [
          (direction + 3) % 4,
          direction,
          (direction + 1) % 4,
          (direction + 2) % 4,
        ];
      else if (mobTile instanceof BallTile)
        return [direction, (direction + 2) % 4];
      else if (mobTile instanceof FireballTile)
        return [
          direction,
          (direction + 1) % 4,
          (direction + 3) % 4,
          (direction + 2) % 4,
        ];
      else if (mobTile instanceof BlobTile)
        return [
          direction,
          (direction + 1) % 4,
          (direction + 2) % 4,
          (direction + 3) % 4,
        ].sort(() => Math.random() - 0.5);
      else if (mobTile instanceof BowlingBallTile) return [direction];
      else if (mobTile instanceof GliderTile)
        return [
          direction,
          (direction + 3) % 4,
          (direction + 1) % 4,
          (direction + 2) % 4,
        ];
      else if (mobTile instanceof WalkerTile)
        return [direction].concat(
          [(direction + 1) % 4, (direction + 3) % 4, (direction + 2) % 4].sort(
            () => Math.random() - 0.5
          )
        );
      else if (mobTile instanceof ParemeciumTile)
        return [
          (direction + 1) % 4,
          direction,
          (direction + 3) % 4,
          (direction + 2) % 4,
        ];
      else if (mobTile instanceof TankTile) return [direction];
      else if (mobTile instanceof BlockTile) {
        if (direction !== null) return [direction];
        return [];
      } else if (mobTile instanceof TeethTile) {
        const teethX = coords[0];
        const teethY = coords[1];
        let closestCoords = null;
        let closestDistance;
        for (let i = 0; i < Constants.MAP_SIZE; i++)
          for (let j = 0; j < Constants.MAP_SIZE; j++) {
            if (
              game.gameMap.getMobTile(i, j) instanceof PlayerTile &&
              game.gameMap.getMobTile(i, j).id !==
                game.findMob(mobTile.id).ownerId
            ) {
              const xDistance = Math.min(
                teethX - i,
                Constants.MAP_SIZE - (teethX - i)
              );
              const yDistance = Math.min(
                teethY - j,
                Constants.MAP_SIZE - (teethY - j)
              );
              const playerDistanceFromMob = Math.sqrt(
                xDistance * xDistance + yDistance * yDistance
              );
              if (
                closestCoords == null ||
                playerDistanceFromMob < closestDistance
              ) {
                closestCoords = [i, j];
                closestDistance = playerDistanceFromMob;
              }
            }
          }

        if (closestCoords !== null) {
          const closestPlayerX = closestCoords[0];
          const closestPlayerY = closestCoords[1];

          const finalXDistance =
            (teethX - closestPlayerX + Constants.MAP_SIZE) % Constants.MAP_SIZE;
          const finalYDistance =
            (teethY - closestPlayerY + Constants.MAP_SIZE) % Constants.MAP_SIZE;
          const halfMapSize = Constants.MAP_SIZE / 2;

          if (finalXDistance === 0) {
            if (finalYDistance < halfMapSize) return [Constants.DIRECTION_UP];
            else return [Constants.DIRECTION_DOWN];
          } else if (finalYDistance === 0) {
            if (finalXDistance < halfMapSize) return [Constants.DIRECTION_LEFT];
            else return [Constants.DIRECTION_RIGHT];
          } else if (
            finalXDistance < halfMapSize &&
            finalYDistance < halfMapSize
          ) {
            if (finalYDistance < finalXDistance)
              return [Constants.DIRECTION_LEFT, Constants.DIRECTION_UP];
            else return [Constants.DIRECTION_UP, Constants.DIRECTION_LEFT];
          } else if (
            finalXDistance < halfMapSize &&
            finalYDistance > halfMapSize
          ) {
            if (Constants.MAP_SIZE - finalYDistance < finalXDistance)
              return [Constants.DIRECTION_LEFT, Constants.DIRECTION_DOWN];
            else return [Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT];
          } else if (
            finalXDistance > halfMapSize &&
            finalYDistance < halfMapSize
          ) {
            if (finalYDistance < Constants.MAP_SIZE - finalXDistance)
              return [Constants.DIRECTION_RIGHT, Constants.DIRECTION_UP];
            else return [Constants.DIRECTION_UP, Constants.DIRECTION_RIGHT];
          } else if (
            finalXDistance > halfMapSize &&
            finalYDistance > halfMapSize
          ) {
            if (
              Constants.MAP_SIZE - finalYDistance <
              Constants.MAP_SIZE - finalXDistance
            )
              return [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN];
            else return [Constants.DIRECTION_DOWN, Constants.DIRECTION_RIGHT];
          }
        }
        return [];
      }
      return [];
    }
    return [direction, (direction + 2) % 4];
  }

  private static mobCanMoveToCoordinates(
    game: Game,
    mobTile: MobTile,
    x: number,
    y: number,
    direction: number
  ) {
    if (
      game.gameMap.getTerrainTile(x, y).solid(game, mobTile.id, direction) ||
      game.gameMap.getObjectTile(x, y)?.solid(game, mobTile.id, direction) ||
      this.solid(game, mobTile.id, direction, game.gameMap.getMobTile(x, y))
    ) {
      return false;
    }
    return true;
  }

  public static setSpriteBasedOnDirection(mobTile: MobTile) {
    if (mobTile instanceof PlayerTile) {
      switch (mobTile.direction) {
        case Constants.DIRECTION_UP:
          mobTile.value = Constants.MOB_PLAYER_UP;
          break;
        case Constants.DIRECTION_LEFT:
          mobTile.value = Constants.MOB_PLAYER_LEFT;
          break;
        case Constants.DIRECTION_DOWN:
          mobTile.value = Constants.MOB_PLAYER_DOWN;
          break;
        case Constants.DIRECTION_RIGHT:
          mobTile.value = Constants.MOB_PLAYER_RIGHT;
          break;
      }
    } else if (mobTile instanceof BallTile) mobTile.value = Constants.MOB_BALL;
    else if (mobTile instanceof FireballTile)
      mobTile.value = Constants.MOB_FIREBALL;
    else if (mobTile instanceof BlobTile) mobTile.value = Constants.MOB_BLOB;
    else if (mobTile instanceof BlockTile) mobTile.value = Constants.MOB_BLOCK;
    else if (mobTile instanceof BowlingBallTile)
      mobTile.value = Constants.MOB_BOWLING_BALL;
    else if (mobTile instanceof BugTile) {
      switch (mobTile.direction) {
        case Constants.DIRECTION_UP:
          mobTile.value = Constants.MOB_BUG_UP;
          break;
        case Constants.DIRECTION_LEFT:
          mobTile.value = Constants.MOB_BUG_LEFT;
          break;
        case Constants.DIRECTION_DOWN:
          mobTile.value = Constants.MOB_BUG_DOWN;
          break;
        case Constants.DIRECTION_RIGHT:
          mobTile.value = Constants.MOB_BUG_RIGHT;
          break;
      }
    } else if (mobTile instanceof GliderTile) {
      switch (mobTile.direction) {
        case Constants.DIRECTION_UP:
          mobTile.value = Constants.MOB_GLIDER_UP;
          break;
        case Constants.DIRECTION_LEFT:
          mobTile.value = Constants.MOB_GLIDER_LEFT;
          break;
        case Constants.DIRECTION_DOWN:
          mobTile.value = Constants.MOB_GLIDER_DOWN;
          break;
        case Constants.DIRECTION_RIGHT:
          mobTile.value = Constants.MOB_GLIDER_RIGHT;
          break;
      }
    } else if (mobTile instanceof ParemeciumTile) {
      switch (mobTile.direction) {
        case Constants.DIRECTION_UP:
          mobTile.value = Constants.MOB_PAREMECIUM_UP_DOWN;
          break;
        case Constants.DIRECTION_LEFT:
          mobTile.value = Constants.MOB_PAREMECIUM_LEFT_RIGHT;
          break;
        case Constants.DIRECTION_DOWN:
          mobTile.value = Constants.MOB_PAREMECIUM_UP_DOWN;
          break;
        case Constants.DIRECTION_RIGHT:
          mobTile.value = Constants.MOB_PAREMECIUM_LEFT_RIGHT;
          break;
      }
    } else if (mobTile instanceof PlayerTile) {
      switch (mobTile.direction) {
        case Constants.DIRECTION_UP:
          mobTile.value = Constants.MOB_PLAYER_UP;
          break;
        case Constants.DIRECTION_LEFT:
          mobTile.value = Constants.MOB_PLAYER_LEFT;
          break;
        case Constants.DIRECTION_DOWN:
          mobTile.value = Constants.MOB_PLAYER_DOWN;
          break;
        case Constants.DIRECTION_RIGHT:
          mobTile.value = Constants.MOB_PLAYER_RIGHT;
          break;
      }
    } else if (mobTile instanceof TankTile) {
      switch (mobTile.direction) {
        case Constants.DIRECTION_UP:
          mobTile.value = Constants.MOB_TANK_UP;
          break;
        case Constants.DIRECTION_LEFT:
          mobTile.value = Constants.MOB_TANK_LEFT;
          break;
        case Constants.DIRECTION_DOWN:
          mobTile.value = Constants.MOB_TANK_DOWN;
          break;
        case Constants.DIRECTION_RIGHT:
          mobTile.value = Constants.MOB_TANK_RIGHT;
          break;
      }
    } else if (mobTile instanceof TeethTile) {
      switch (mobTile.direction) {
        case Constants.DIRECTION_UP:
          mobTile.value = Constants.MOB_TEETH_UP;
          break;
        case Constants.DIRECTION_LEFT:
          mobTile.value = Constants.MOB_TEETH_LEFT;
          break;
        case Constants.DIRECTION_DOWN:
          mobTile.value = Constants.MOB_TEETH_DOWN;
          break;
        case Constants.DIRECTION_RIGHT:
          mobTile.value = Constants.MOB_TEETH_RIGHT;
          break;
      }
    } else if (mobTile instanceof WalkerTile) {
      switch (mobTile.direction) {
        case Constants.DIRECTION_UP:
          mobTile.value = Constants.MOB_WALKER_UP_DOWN;
          break;
        case Constants.DIRECTION_LEFT:
          mobTile.value = Constants.MOB_WALKER_LEFT_RIGHT;
          break;
        case Constants.DIRECTION_DOWN:
          mobTile.value = Constants.MOB_WALKER_UP_DOWN;
          break;
        case Constants.DIRECTION_RIGHT:
          mobTile.value = Constants.MOB_WALKER_LEFT_RIGHT;
          break;
      }
    }
  }

  public static kill(game: Game, mobTile: MobTile) {
    if (mobTile == null) return;
    if (mobTile instanceof PlayerTile) {
      game.players.map((player) => {
        if (player.id === mobTile.id) player.kill();
      });
      const coords: number[] = game.findPlayerCoordinates(mobTile.id);
      game.gameMap.setMobTile(coords[0], coords[1], null);
    } else {
      game.mobs.map((mob) => {
        if (mob.id === mobTile.id) mob.kill();
      });
      const coords = game.findMobTileCoordinates(mobTile.id);
      game.gameMap.setMobTile(coords[0], coords[1], null);
    }
  }

  public static interactionFromPlayer(
    game: Game,
    interactingId: string,
    mobTile: MobTile
  ) {
    if (mobTile == null || mobTile instanceof PlayerTile) return;
    if (!(mobTile instanceof BlockTile)) game.kill(interactingId);
    if (mobTile instanceof BowlingBallTile) game.kill(mobTile.id);
  }

  public static interactionFromMob(
    game: Game,
    interactingId: string,
    mobTile: MobTile
  ) {
    if (mobTile instanceof PlayerTile) {
      game.kill(mobTile.id);
      if (game.findMobTile(interactingId).value === Constants.MOB_BOWLING_BALL)
        game.kill(game.findMobTile(interactingId).id);
    }
    if (mobTile instanceof BowlingBallTile) {
      game.kill(interactingId);
      game.kill(mobTile.id);
    }
  }

  public static solid(
    game: Game,
    interactingId: string,
    interactingDirection: number,
    mobTile: MobTile
  ) {
    if (mobTile == null) return false;
    else if (mobTile instanceof PlayerTile) {
      if (game.findPlayer(interactingId)) return true;
      if (game.findMob(interactingId))
        return game.findMob(interactingId).ownerId === mobTile.id;
      return true;
    }
    if (game.findPlayer(interactingId) && !(mobTile instanceof BlockTile)) {
      if (mobTile instanceof BlockTile) {
        const originalDirection = mobTile.direction;
        const coords = game.findMobTileCoordinates(mobTile.id);
        mobTile.direction = interactingDirection;
        MobService.move(game, mobTile);
        const newCoords = game.findMobTileCoordinates(mobTile.id);
        if (coords && newCoords) {
          if (coords[0] === newCoords[0] && coords[1] === newCoords[1]) {
            mobTile.direction = originalDirection;
            if (
              mobTile.lastHitTime <= 0 ||
              mobTile.lastHitId !== interactingId
            ) {
              mobTile.health--;
              mobTile.lastHitId = interactingId;
              mobTile.lastHitTime = Constants.MOVEMENT_SPEED * 2;
              switch (mobTile.health) {
                case 3:
                  mobTile.value = Constants.MOB_BLOCK_BROKEN;
                  break;
                case 2:
                  mobTile.value = Constants.MOB_BLOCK_BROKEN_2;
                  break;
                case 1:
                  mobTile.value = Constants.MOB_BLOCK_BROKEN_3;
                  break;
                case 0:
                  MobService.kill(
                    game,
                    game.gameMap.getMobTile(coords[0], coords[1])
                  );
                  if (
                    game.gameMap.getTerrainTile(coords[0], coords[1]).value ===
                    Constants.TERRAIN_FLOOR
                  ) {
                    game.gameMap.setTerrainTile(
                      coords[0],
                      coords[1],
                      new DirtTile()
                    );
                    game.updatePlayerCooldown(interactingId);
                  }
                  break;
              }
            }
            return true;
          }
          return false;
        }
      } else return game.findMob(mobTile.id).ownerId === interactingId;
    } else if (
      game.findMobTile(interactingId) instanceof BowlingBallTile &&
      !(mobTile instanceof BowlingBallTile)
    )
      return false;
    else if (game.findMob(interactingId) && mobTile instanceof BowlingBallTile)
      return false;
    else if (game.findMob(interactingId)) return true;
    return true;
  }
}
