import { BlankTile } from "./blankTile";
import { TerrainTile } from "../../terrainTile";
import { Game } from "objects/game";
import { Constants } from "../../../constants/constants";
import { Coordinates } from '../../coordinates';

export class KeyDoorTile implements TerrainTile {
  value;
  id = null;

  constructor(value: number) {
    this.value = value;
  }

  interactionFromPlayer(game: Game, id: string, coords: Coordinates): void {
    switch (this.value) {
      case Constants.TERRAIN_RED_KEY_DOOR:
        game.findPlayer(id).inventory.redKeys--;
        break;
      case Constants.TERRAIN_BLUE_KEY_DOOR:
        game.findPlayer(id).inventory.blueKeys--;
        break;
      case Constants.TERRAIN_YELLOW_KEY_DOOR:
        game.findPlayer(id).inventory.yellowKeys--;
        break;
    }
    game.gameMap.setTerrainTile(coords, new BlankTile());
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean {
    if (game.findPlayer(id)) {
      switch (this.value) {
        case Constants.TERRAIN_RED_KEY_DOOR:
          return game.findPlayer(id).inventory.redKeys === 0;
        case Constants.TERRAIN_BLUE_KEY_DOOR:
          return game.findPlayer(id).inventory.blueKeys === 0;
        case Constants.TERRAIN_YELLOW_KEY_DOOR:
          return game.findPlayer(id).inventory.yellowKeys === 0;
        case Constants.TERRAIN_GREEN_KEY_DOOR:
          return game.findPlayer(id).inventory.greenKey === false;
      }
    }
    if (game.findMob(id)) return true;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }

  canSpawnMobOnIt(direction: number): boolean {
    return false;
  }
}
