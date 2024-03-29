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
import { Coordinates } from '../objects/coordinates';
import { GameMapHelper } from './gameMapHelper';

export class MobService {
  static move(game: Game, mobTile: MobTile): void {
    const coords = game.findMobTileCoordinates(mobTile.id);
    const mob = game.findMob(mobTile.id);

    if (coords) {
      const preferredDirections = this.getPreferredDirections(game, mobTile);
      for (const directionAttempt of preferredDirections) {
        if (
          !game
            .getTerrainTile(coords)
            .getBlockedMobDirections(game, mobTile.id)
            .includes(directionAttempt)
        ) {
          let newCoords = coords;
          switch (directionAttempt) {
            case Constants.DIRECTION_UP:
              newCoords = newCoords.up();
              break;
            case Constants.DIRECTION_DOWN:
              newCoords = newCoords.down();
              break;
            case Constants.DIRECTION_LEFT:
              newCoords = newCoords.left();
              break;
            case Constants.DIRECTION_RIGHT:
              newCoords = newCoords.right();
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
              newCoords,
              directionAttempt
            )
          ) {
            mobTile.direction = directionAttempt;
            this.setSpriteBasedOnDirection(mobTile);
            game
              .getTerrainTile(newCoords)
              .interactionFromMob(game, mob.id, newCoords);
            if (game.findMob(mob.id).alive)
              game
                .getObjectTile(newCoords)
                ?.interactionFromMob(game, mob.id, newCoords);
            if (game.findMob(mob.id).alive) {
              if (mobTile instanceof BowlingBallTile) {
                if (game.getMobTile(newCoords)) {
                  this.kill(game, game.getMobTile(newCoords));
                  this.kill(game, mobTile);
                }
              } else
                this.interactionFromMob(
                  game,
                  mob.id,
                  game.getMobTile(newCoords)
                );
            }
            if (mob.alive) {
              game.setMobTile(coords, null);
              game.setMobTile(newCoords, mobTile);
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
    var forward = direction;
    var right = (direction + 1) % 4;
    var backward = (direction + 2) % 4;
    var left = (direction + 3) % 4;
    if (
      GameMapHelper.isForceField(game.getTerrainTile(coords).value)
    )
      return [ forward ];
    else if (
      GameMapHelper.isRandomForceField(
        game.getTerrainTile(coords).value
      )
    )
      return [Math.floor(Math.random() * 4)];
    else if (
      game.getTerrainTile(coords).value ===
      Constants.TERRAIN_TELEPORT
    )
      return [ forward ];
    else if (
      GameMapHelper.isIce(game.getTerrainTile(coords).value)
    ) {
      switch (game.getTerrainTile(coords).value) {
        case Constants.TERRAIN_ICE:
          return [forward, backward];
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
        return [ left, forward, right, backward ];
      else if (mobTile instanceof BallTile)
        return [ forward, backward ];
      else if (mobTile instanceof FireballTile)
        return [ forward, right, left, backward ];
      else if (mobTile instanceof BlobTile)
        return [ forward, right, left, backward ].sort(() => Math.random() - 0.5);
      else if (mobTile instanceof BowlingBallTile)
        return [ forward ];
      else if (mobTile instanceof GliderTile)
        return [ forward, left, right, backward ];
      else if (mobTile instanceof WalkerTile)
        return [ forward ].concat([ right, left, backward ].sort(() => Math.random() - 0.5));
      else if (mobTile instanceof ParemeciumTile)
        return [ right, forward, left, backward ];
      else if (mobTile instanceof TankTile)
        return [ forward];
      else if (mobTile instanceof BlockTile) {
        if (direction !== null)
          return [forward];
        else
          return [];
      } else if (mobTile instanceof TeethTile) {
        const teethX = coords.x;
        const teethY = coords.y;
        let closestCoords = null;
        let closestDistance;
        for (let i = 0; i < game.dimensions.width; i++)
          for (let j = 0; j < game.dimensions.height; j++) {
            let searchCoords = new Coordinates(i, j, game.dimensions.width, game.dimensions.height);
            if (
              game.getMobTile(searchCoords) instanceof PlayerTile &&
              game.getMobTile(searchCoords).id !==
                game.findMob(mobTile.id).ownerId
            ) {
              const xDistance = Math.min(
                teethX - i,
                game.dimensions.width - (teethX - i)
              );
              const yDistance = Math.min(
                teethY - j,
                game.dimensions.height - (teethY - j)
              );
              const playerDistanceFromMob = Math.sqrt(
                xDistance * xDistance + yDistance * yDistance
              );
              if (
                closestCoords == null ||
                playerDistanceFromMob < closestDistance
              ) {
                closestCoords = new Coordinates(i, j, game.dimensions.width, game.dimensions.height);
                closestDistance = playerDistanceFromMob;
              }
            }
          }

        if (closestCoords !== null) {
          const closestPlayerX = closestCoords.x;
          const closestPlayerY = closestCoords.y;
          const finalXDistance =
            (teethX - closestPlayerX + game.dimensions.width) % game.dimensions.width;
          const finalYDistance =
            (teethY - closestPlayerY + game.dimensions.height) % game.dimensions.height;
          const halfXMapSize = game.dimensions.width / 2;
          const halfYMapSize = game.dimensions.height / 2;

          if (finalXDistance === 0) {
            if (finalYDistance < halfYMapSize) return [Constants.DIRECTION_UP];
            else return [Constants.DIRECTION_DOWN];
          } else if (finalYDistance === 0) {
            if (finalXDistance < halfXMapSize) return [Constants.DIRECTION_LEFT];
            else return [Constants.DIRECTION_RIGHT];
          } else if (
            finalXDistance < halfXMapSize &&
            finalYDistance < halfYMapSize
          ) {
            if (finalYDistance < finalXDistance)
              return [Constants.DIRECTION_LEFT, Constants.DIRECTION_UP];
            else return [Constants.DIRECTION_UP, Constants.DIRECTION_LEFT];
          } else if (
            finalXDistance < halfXMapSize &&
            finalYDistance > halfYMapSize
          ) {
            if (game.dimensions.height - finalYDistance < finalXDistance)
              return [Constants.DIRECTION_LEFT, Constants.DIRECTION_DOWN];
            else return [Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT];
          } else if (
            finalXDistance > halfXMapSize &&
            finalYDistance < halfYMapSize
          ) {
            if (finalYDistance < game.dimensions.width - finalXDistance)
              return [Constants.DIRECTION_RIGHT, Constants.DIRECTION_UP];
            else return [Constants.DIRECTION_UP, Constants.DIRECTION_RIGHT];
          } else if (
            finalXDistance > halfXMapSize &&
            finalYDistance > halfYMapSize
          ) {
            if (
              game.dimensions.height - finalYDistance <
              game.dimensions.width - finalXDistance
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
    coords: Coordinates,
    direction: number
  ) {
    if (
      game.getTerrainTile(coords).solid(game, mobTile.id, direction) ||
      game.getObjectTile(coords)?.solid(game, mobTile.id, direction) ||
      this.solid(game, mobTile.id, direction, game.getMobTile(coords))
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
    else if (mobTile instanceof BlockTile) {
      switch (mobTile.health)
      {
        case 3: mobTile.value = Constants.MOB_BLOCK_BROKEN; break;
        case 2: mobTile.value = Constants.MOB_BLOCK_BROKEN_2; break;
        case 1: mobTile.value = Constants.MOB_BLOCK_BROKEN_3; break;
        default: mobTile.value = Constants.MOB_BLOCK; break;
      }
    }
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
      const coords: Coordinates = game.findPlayerCoordinates(mobTile.id);
      game.setMobTile(coords, null);
    } else {
      game.mobs.map((mob) => {
        if (mob.id === mobTile.id) mob.kill();
      });
      const coords = game.findMobTileCoordinates(mobTile.id);
      game.setMobTile(coords, null);
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
    if (game.findPlayer(interactingId)) {
      if (mobTile instanceof BlockTile) {
        const originalDirection = mobTile.direction;
        const coords = game.findMobTileCoordinates(mobTile.id);
        mobTile.direction = interactingDirection;
        MobService.move(game, mobTile);
        const newCoords = game.findMobTileCoordinates(mobTile.id);
        if (coords && newCoords) {
          if (coords.x === newCoords.x && coords.y === newCoords.y) {
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
                    game.getMobTile(coords)
                  );
                  if (
                    game.getTerrainTile(coords).value ===
                    Constants.TERRAIN_FLOOR
                  ) {
                    game.setTerrainTile(
                      coords,
                      new DirtTile()
                    );
                    game.findPlayer(interactingId).resetCooldown();
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
