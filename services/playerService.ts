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
import { Coordinates } from '../objects/coordinates';

export class PlayerService {
  static throwBowlingBall(game: Game, playerTile: PlayerTile) {
    var newCoords: Coordinates = game.findPlayerCoordinates(playerTile.id);
    switch (playerTile.direction) {
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
        .canSpawnMobOnIt(playerTile.direction)
    ) {
      game.findPlayer(playerTile.id).inventory.bowlingBalls--;
      const mobTileAtNewCoords = game.gameMap.getMobTile(
        newCoords
      );
      if (mobTileAtNewCoords != null) MobService.kill(game, mobTileAtNewCoords);
      else if (mobTileAtNewCoords === null) {
        game.gameMap.addMob(
          newCoords.x,
          newCoords.y,
          new BowlingBallTile(playerTile.direction),
          game.mobs,
          playerTile.id
        );
        const newMobTileAtNewCoords = game.gameMap.getMobTile(
          newCoords
        );
        game.gameMap.objectTiles[newCoords.x][
          newCoords.y
        ]?.interactionFromMob(
          game,
          newMobTileAtNewCoords.id,
          newCoords
        );
        if (newMobTileAtNewCoords)
          game.gameMap.terrainTiles[newCoords.x][
            newCoords.y
          ]?.interactionFromMob(
            game,
            newMobTileAtNewCoords.id,
            newCoords
          );
      }
    }
  }

  static callWhistle(game: Game, playerTile: PlayerTile) {
    var newCoords: Coordinates = game.findPlayerCoordinates(playerTile.id);
    switch (playerTile.direction) {
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
        .canSpawnMobOnIt(playerTile.direction)
    ) {
      const mobTileAtNewCoords = game.gameMap.getMobTile(
        newCoords
      );
      if (mobTileAtNewCoords === null) {
        game.findPlayer(playerTile.id).inventory.whistles--;
        const randomMobValue = Math.floor(Math.random() * 9);
        if (randomMobValue === 0)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new BallTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 1)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new BlobTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 2)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new BugTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 3)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new FireballTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 4)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new GliderTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 5)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new ParemeciumTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 6)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new TankTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 7)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new TeethTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );
        else if (randomMobValue === 8)
          game.gameMap.addMob(
            newCoords.x,
            newCoords.y,
            new WalkerTile(playerTile.direction),
            game.mobs,
            playerTile.id
          );

        const newMobTileAtNewCoords = game.gameMap.getMobTile(
          newCoords
        );
        game.gameMap.objectTiles[newCoords.x][
          newCoords.y
        ]?.interactionFromMob(
          game,
          newMobTileAtNewCoords.id,
          newCoords
        );
        if (newMobTileAtNewCoords)
          game.gameMap.terrainTiles[newCoords.x][
            newCoords.y
          ]?.interactionFromMob(
            game,
            newMobTileAtNewCoords.id,
            newCoords
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
    const coords: Coordinates = game.findPlayerCoordinates(playerTile.id);
    const currentPlayer: Player = game.findPlayer(playerTile.id);
    currentPlayer.attemptedMoveCooldown = Constants.MOVEMENT_SPEED * 2;
    MobService.setSpriteBasedOnDirection(playerTile);
    if (
      (coords && currentPlayer.cooldown <= 0) ||
      moveType === Constants.MOVE_TYPE_AUTOMATIC
    ) {
      if (
        moveType === Constants.MOVE_TYPE_AUTOMATIC ||
        !game.gameMap
          .getTerrainTile(coords)
          .getBlockedPlayerDirections(game, playerTile.id)
          .includes(direction)
      ) {
        playerTile.direction = direction;
        MobService.setSpriteBasedOnDirection(playerTile);
        let newCoords = coords;
        switch (direction) {
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
        if (this.canPlayerMove(game, playerTile, newCoords, direction)) {
          MobService.interactionFromPlayer(
            game,
            playerTile.id,
            game.gameMap.getMobTile(newCoords)
          );
          if (game.findPlayer(playerTile.id).alive)
            game.gameMap
              .getObjectTile(newCoords)
              ?.interactionFromPlayer(game, playerTile.id, newCoords);
          if (game.findPlayer(playerTile.id).alive)
            game.gameMap
              .getTerrainTile(newCoords)
              .interactionFromPlayer(game, playerTile.id, newCoords);

          if (currentPlayer.alive) {
            game.gameMap.setMobTile(coords, null);
            game.gameMap.setMobTile(newCoords, playerTile);
            game.updatePlayerCooldown(playerTile.id);
          }
        } else if (this.isIce(game.gameMap.getTerrainTile(coords).value)) {
          direction = this.getWallBounceIceDirection(
            game.gameMap.getTerrainTile(coords).value,
            direction
          );
          playerTile.direction = direction;
          MobService.setSpriteBasedOnDirection(playerTile);
          let newCoords = coords;
          switch (direction) {
            case Constants.DIRECTION_UP:
              newCoords = coords.up();
              break;
            case Constants.DIRECTION_DOWN:
              newCoords = coords.down();
              break;
            case Constants.DIRECTION_LEFT:
              newCoords = coords.left();
              break;
            case Constants.DIRECTION_RIGHT:
              newCoords = coords.right();
              break;
            default:
              break;
          }
          if (this.canPlayerMove(game, playerTile, newCoords, direction)) {
            MobService.interactionFromPlayer(
              game,
              playerTile.id,
              game.gameMap.getMobTile(newCoords)
            );
            if (game.findPlayer(playerTile.id).alive)
              game.gameMap
                .getObjectTile(newCoords)
                ?.interactionFromPlayer(game, playerTile.id, newCoords);
            if (game.findPlayer(playerTile.id).alive)
              game.gameMap
                .getTerrainTile(newCoords)
                .interactionFromPlayer(game, playerTile.id, newCoords);

            if (currentPlayer.alive) {
              game.gameMap.setMobTile(coords, null);
              game.gameMap.setMobTile(newCoords, playerTile);
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
    coords: Coordinates,
    direction: number
  ) {
    if (
      game.gameMap.getTerrainTile(coords).solid(game, playerTile.id, direction) ||
      game.gameMap.getObjectTile(coords)?.solid(game, playerTile.id, direction) ||
      MobService.solid(
        game,
        playerTile.id,
        direction,
        game.gameMap.getMobTile(coords)
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
