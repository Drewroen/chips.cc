import { TerrainTile } from "../../terrainTile";
import { Game } from "objects/game";
import { Constants } from "../../../constants/constants";
import { TankTile } from "./../../../objects/mobTile";
import { GameMapHelper } from '../../../services/gameMapHelper';

export class TankToggleButtonTile implements TerrainTile {
  value = Constants.TERRAIN_TANK_TOGGLE_BUTTON;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    game.tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.mob instanceof TankTile) {
          const mobCoords = game.findMobTileCoordinates(tile.mob.id);
          const terrainValue = game.getTerrainTile(
            mobCoords
          ).value;
          if (
            !GameMapHelper.isForceField(terrainValue) &&
            !GameMapHelper.isRandomForceField(terrainValue) &&
            !GameMapHelper.isIce(terrainValue) &&
            !GameMapHelper.isMobOnCloneMachine(game, tile.mob.id)
          )
            tile.mob.direction = (tile.mob.direction + 2) % 4;
        }
      });
    });
  }

  interactionFromMob(game: Game, id: string): void {
    game.tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.mob instanceof TankTile) {
          const mobCoords = game.findMobTileCoordinates(tile.mob.id);
          const terrainValue = game.getTerrainTile(
            mobCoords
          ).value;
          if (
            !GameMapHelper.isForceField(terrainValue) &&
            !GameMapHelper.isRandomForceField(terrainValue) &&
            !GameMapHelper.isIce(terrainValue) &&
            !GameMapHelper.isMobOnCloneMachine(game, tile.mob.id)
          )
            tile.mob.direction = (tile.mob.direction + 2) % 4;
        }
      });
    });
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
}
