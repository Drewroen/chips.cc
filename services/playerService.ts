import { Constants } from "./../constants/constants";
import { Game } from "objects/game";
import {
  BowlingBallTile,
  BallTile,
  BlobTile,
  BugTile,
  FireballTile,
  GliderTile,
  ParemeciumTile,
  TankTile,
  TeethTile,
  WalkerTile,
  PlayerTile,
} from "./../objects/mobTile";
import { Player } from "objects/player";
import { MobService } from "./mobService";

export class PlayerService {
  static throwBowlingBall(game: Game, playerTile: PlayerTile) {
    const newCoords: number[] = game.findPlayerCoordinates(playerTile.id);
    switch (playerTile.direction) {
      case Constants.DIRECTION_UP:
        newCoords[1] =
          (newCoords[1] - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        break;
      case Constants.DIRECTION_RIGHT:
        newCoords[0] =
          (newCoords[0] + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        break;
      case Constants.DIRECTION_DOWN:
        newCoords[1] =
          (newCoords[1] + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        break;
      case Constants.DIRECTION_LEFT:
        newCoords[0] =
          (newCoords[0] - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        break;
    }
    if (
      game.gameMap
        .getTerrainTile(newCoords[0], newCoords[1])
        .canSpawnMobOnIt(playerTile.direction)
    ) {
      game.findPlayer(playerTile.id).inventory.bowlingBalls--;
      const mobTileAtNewCoords = game.gameMap.getMobTile(
        newCoords[0],
        newCoords[1]
      );
      if (mobTileAtNewCoords != null) MobService.kill(game, mobTileAtNewCoords);
      else if (mobTileAtNewCoords === null) {
        game.gameMap.addMob(
          newCoords[0],
          newCoords[1],
          new BowlingBallTile(playerTile.direction),
          game.mobs,
          playerTile.id
        );
        const newMobTileAtNewCoords = game.gameMap.getMobTile(
          newCoords[0],
          newCoords[1]
        );
        game.gameMap.objectTiles[newCoords[0]][
          newCoords[1]
        ]?.interactionFromMob(
          game,
          newMobTileAtNewCoords.id,
          newCoords[0],
          newCoords[1]
        );
        if (newMobTileAtNewCoords)
          game.gameMap.terrainTiles[newCoords[0]][
            newCoords[1]
          ]?.interactionFromMob(
            game,
            newMobTileAtNewCoords.id,
            newCoords[0],
            newCoords[1]
          );
      }
    }
  }

  static callWhistle(game: Game, playerTile: PlayerTile) {
    const newCoords: number[] = game.findPlayerCoordinates(playerTile.id);
    switch (playerTile.direction) {
      case Constants.DIRECTION_UP:
        newCoords[1] =
          (newCoords[1] - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        break;
      case Constants.DIRECTION_RIGHT:
        newCoords[0] =
          (newCoords[0] + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        break;
      case Constants.DIRECTION_DOWN:
        newCoords[1] =
          (newCoords[1] + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        break;
      case Constants.DIRECTION_LEFT:
        newCoords[0] =
          (newCoords[0] - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        break;
    }
    if (
      game.gameMap
        .getTerrainTile(newCoords[0], newCoords[1])
        .canSpawnMobOnIt(playerTile.direction)
    ) {
      const mobTileAtNewCoords = game.gameMap.getMobTile(
        newCoords[0],
        newCoords[1]
      );
      if (mobTileAtNewCoords === null) {
        game.findPlayer(playerTile.id).inventory.whistles--;
        const randomMobValue = Math.floor(Math.random() * 9);
        if (randomMobValue === 0)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new BallTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 1)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new BlobTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 2)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new BugTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 3)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new FireballTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 4)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new GliderTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 5)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new ParemeciumTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 6)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new TankTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 7)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new TeethTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 8)
          game.gameMap.addMob(
            newCoords[0],
            newCoords[1],
            new WalkerTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );

        const newMobTileAtNewCoords = game.gameMap.getMobTile(
          newCoords[0],
          newCoords[1]
        );
        game.gameMap.objectTiles[newCoords[0]][
          newCoords[1]
        ]?.interactionFromMob(
          game,
          newMobTileAtNewCoords.id,
          newCoords[0],
          newCoords[1]
        );
        if (newMobTileAtNewCoords)
          game.gameMap.terrainTiles[newCoords[0]][
            newCoords[1]
          ]?.interactionFromMob(
            game,
            newMobTileAtNewCoords.id,
            newCoords[0],
            newCoords[1]
          );
      }
    }
  }

  static movePlayer(
    game: Game,
    playerTile: PlayerTile,
    direction: number,
    moveType: number
  ): void {
    const coords: number[] = game.findPlayerCoordinates(playerTile.id);
    const currentPlayer: Player = game.findPlayer(playerTile.id);
    currentPlayer.attemptedMoveCooldown = Constants.MOVEMENT_SPEED * 2;
    MobService.setSpriteBasedOnDirection(playerTile);
    if (
      (coords && currentPlayer.cooldown <= 0) ||
      moveType === Constants.MOVE_TYPE_AUTOMATIC
    ) {
      const i = coords[0];
      const j = coords[1];
      if (
        moveType === Constants.MOVE_TYPE_AUTOMATIC ||
        !game.gameMap
          .getTerrainTile(i, j)
          .getBlockedPlayerDirections(game, playerTile.id)
          .includes(direction)
      ) {
        playerTile.direction = direction;
        MobService.setSpriteBasedOnDirection(playerTile);
        let newI = i;
        let newJ = j;
        switch (direction) {
          case Constants.DIRECTION_UP:
            newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
            break;
          case Constants.DIRECTION_DOWN:
            newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
            break;
          case Constants.DIRECTION_LEFT:
            newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
            break;
          case Constants.DIRECTION_RIGHT:
            newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
            break;
          default:
            break;
        }
        if (this.canPlayerMove(game, playerTile, newI, newJ, direction)) {
          MobService.interactionFromPlayer(
            game,
            playerTile.id,
            game.gameMap.getMobTile(newI, newJ)
          );
          if (game.findPlayer(playerTile.id).alive)
            game.gameMap
              .getObjectTile(newI, newJ)
              ?.interactionFromPlayer(game, playerTile.id, newI, newJ);
          if (game.findPlayer(playerTile.id).alive)
            game.gameMap
              .getTerrainTile(newI, newJ)
              .interactionFromPlayer(game, playerTile.id, newI, newJ);

          if (currentPlayer.alive) {
            game.gameMap.setMobTile(i, j, null);
            game.gameMap.setMobTile(newI, newJ, playerTile);
            game.updatePlayerCooldown(playerTile.id);
          }
        } else if (this.isIce(game.gameMap.getTerrainTile(i, j).value)) {
          direction = this.getWallBounceIceDirection(
            game.gameMap.getTerrainTile(i, j).value,
            direction
          );
          playerTile.direction = direction;
          MobService.setSpriteBasedOnDirection(playerTile);
          newI = i;
          newJ = j;
          switch (direction) {
            case Constants.DIRECTION_UP:
              newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
              break;
            case Constants.DIRECTION_DOWN:
              newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
              break;
            case Constants.DIRECTION_LEFT:
              newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
              break;
            case Constants.DIRECTION_RIGHT:
              newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE;
              break;
            default:
              break;
          }
          if (this.canPlayerMove(game, playerTile, newI, newJ, direction)) {
            MobService.interactionFromPlayer(
              game,
              playerTile.id,
              game.gameMap.getMobTile(newI, newJ)
            );
            if (game.findPlayer(playerTile.id).alive)
              game.gameMap
                .getObjectTile(newI, newJ)
                ?.interactionFromPlayer(game, playerTile.id, newI, newJ);
            if (game.findPlayer(playerTile.id).alive)
              game.gameMap
                .getTerrainTile(newI, newJ)
                .interactionFromPlayer(game, playerTile.id, newI, newJ);

            if (currentPlayer.alive) {
              game.gameMap.setMobTile(i, j, null);
              game.gameMap.setMobTile(newI, newJ, playerTile);
              game.updatePlayerCooldown(playerTile.id);
            }
          }
        }
      }
    }
  }

  private static canPlayerMove(
    game: Game,
    playerTile: PlayerTile,
    i: number,
    j: number,
    direction: number
  ) {
    if (
      game.gameMap.getTerrainTile(i, j).solid(game, playerTile.id, direction) ||
      game.gameMap.getObjectTile(i, j)?.solid(game, playerTile.id, direction) ||
      MobService.solid(
        game,
        playerTile.id,
        direction,
        game.gameMap.getMobTile(i, j)
      )
    ) {
      return false;
    }
    return true;
  }

  private static isIce(value: number) {
    return [
      Constants.TERRAIN_ICE,
      Constants.TERRAIN_ICE_CORNER_DOWN_LEFT,
      Constants.TERRAIN_ICE_CORNER_LEFT_UP,
      Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN,
      Constants.TERRAIN_ICE_CORNER_UP_RIGHT,
    ].includes(value);
  }

  private static getWallBounceIceDirection(
    value: number,
    direction: number
  ): number {
    switch (value) {
      case Constants.TERRAIN_ICE:
        return (direction + 2) % 4;
      case Constants.TERRAIN_ICE_CORNER_DOWN_LEFT:
        return direction === Constants.DIRECTION_DOWN
          ? Constants.DIRECTION_LEFT
          : Constants.DIRECTION_DOWN;
      case Constants.TERRAIN_ICE_CORNER_LEFT_UP:
        return direction === Constants.DIRECTION_LEFT
          ? Constants.DIRECTION_UP
          : Constants.DIRECTION_LEFT;
      case Constants.TERRAIN_ICE_CORNER_UP_RIGHT:
        return direction === Constants.DIRECTION_UP
          ? Constants.DIRECTION_RIGHT
          : Constants.DIRECTION_UP;
      case Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN:
        return direction === Constants.DIRECTION_RIGHT
          ? Constants.DIRECTION_DOWN
          : Constants.DIRECTION_RIGHT;
    }
  }
}
