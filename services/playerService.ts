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
  MobTile,
} from "./../objects/mobTile";
import { Player } from "objects/player";
import { MobService } from "./mobService";
import { Coordinates } from '../objects/coordinates';
import { GameService } from './gameService';

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
      game
        .getTerrainTile(newCoords)
        .canSpawnMobOnIt(playerTile.direction)
    ) {
      game.findPlayer(playerTile.id).inventory.bowlingBalls--;
      const mobTileAtNewCoords = game.getMobTile(
        newCoords
      );
      if (mobTileAtNewCoords != null) MobService.kill(game, mobTileAtNewCoords);
      else if (mobTileAtNewCoords === null) {
        GameService.addMob(
          game,
          newCoords.x,
          newCoords.y,
          new BowlingBallTile(playerTile.direction),
          playerTile.id
        );
        const newMobTileAtNewCoords = game.getMobTile(
          newCoords
        );
        game.tiles[newCoords.x][
          newCoords.y
        ].object?.interactionFromMob(
          game,
          newMobTileAtNewCoords.id,
          newCoords
        );
        if (newMobTileAtNewCoords)
          game.tiles[newCoords.x][
            newCoords.y
          ].terrain?.interactionFromMob(
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
      game
        .getTerrainTile(newCoords)
        .canSpawnMobOnIt(playerTile.direction)
    ) {
      const mobTileAtNewCoords = game.getMobTile(
        newCoords
      );
      if (mobTileAtNewCoords === null) {
        game.findPlayer(playerTile.id).inventory.whistles--;
        const randomMobValue = Math.floor(Math.random() * 9);

        var newMob: MobTile;
        switch (randomMobValue)
        {
          case 0: newMob = new BallTile(playerTile.direction); break;
          case 1: newMob = new BlobTile(playerTile.direction); break;
          case 2: newMob = new BugTile(playerTile.direction); break;
          case 3: newMob = new FireballTile(playerTile.direction); break;
          case 4: newMob = new GliderTile(playerTile.direction); break;
          case 5: newMob = new ParemeciumTile(playerTile.direction); break;
          case 6: newMob = new TankTile(playerTile.direction); break;
          case 7: newMob = new TeethTile(playerTile.direction); break;
          case 8: newMob = new WalkerTile(playerTile.direction); break;
        }

        GameService.addMob(game, newCoords.x, newCoords.y, newMob, playerTile.id);

        const newMobTileAtNewCoords = game.getMobTile(
          newCoords
        );
        game.tiles[newCoords.x][
          newCoords.y
        ].object?.interactionFromMob(
          game,
          newMobTileAtNewCoords.id,
          newCoords
        );
        if (newMobTileAtNewCoords)
          game.tiles[newCoords.x][
            newCoords.y
          ].terrain?.interactionFromMob(
            game,
            newMobTileAtNewCoords.id,
            newCoords
          );
      }
    }
  }

  static movePlayer(
    game: Game,
    id: string,
    direction: number,
    moveType: number
  ): void {
    const playerTile = game.findPlayerTile(id);
    if (!playerTile)
      return;
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
        !game
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
            game.getMobTile(newCoords)
          );
          if (game.findPlayer(playerTile.id).alive)
            game
              .getObjectTile(newCoords)
              ?.interactionFromPlayer(game, playerTile.id, newCoords);
          if (game.findPlayer(playerTile.id).alive)
            game
              .getTerrainTile(newCoords)
              .interactionFromPlayer(game, playerTile.id, newCoords);

          if (currentPlayer.alive) {
            game.setMobTile(coords, null);
            game.setMobTile(newCoords, playerTile);
            game.findPlayer(playerTile.id).resetCooldown();
          }
        } else if (this.isIce(game.getTerrainTile(coords).value)) {
          direction = this.getWallBounceIceDirection(
            game.getTerrainTile(coords).value,
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
              game.getMobTile(newCoords)
            );
            if (game.findPlayer(playerTile.id).alive)
              game
                .getObjectTile(newCoords)
                ?.interactionFromPlayer(game, playerTile.id, newCoords);
            if (game.findPlayer(playerTile.id).alive)
              game
                .getTerrainTile(newCoords)
                .interactionFromPlayer(game, playerTile.id, newCoords);

            if (currentPlayer.alive) {
              game.setMobTile(coords, null);
              game.setMobTile(newCoords, playerTile);
              game.findPlayer(playerTile.id).resetCooldown();
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
      game.getTerrainTile(coords).solid(game, playerTile.id, direction) ||
      game.getObjectTile(coords)?.solid(game, playerTile.id, direction) ||
      MobService.solid(
        game,
        playerTile.id,
        direction,
        game.getMobTile(coords)
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
