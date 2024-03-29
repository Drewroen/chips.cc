import { Constants } from '../constants/constants';
import { Coordinates } from '../objects/coordinates';
import { Game } from '../objects/game';
import { BlankTile } from '../objects/gameTiles/terrain/blankTile';
import { BlueWallTile } from '../objects/gameTiles/terrain/blueWallTile';
import { CellBlockTile } from '../objects/gameTiles/terrain/cellBlockTile';
import { CloneMachineButtonTile } from '../objects/gameTiles/terrain/cloneMachineButtonTile';
import { CloneMachineTile } from '../objects/gameTiles/terrain/cloneMachineTile';
import { DirtTile } from '../objects/gameTiles/terrain/dirtTile';
import { FireTile } from '../objects/gameTiles/terrain/fireTile';
import { ForceTile } from '../objects/gameTiles/terrain/forceTile';
import { GravelTile } from '../objects/gameTiles/terrain/gravelTile';
import { IceTile } from '../objects/gameTiles/terrain/iceTile';
import { KeyDoorTile } from '../objects/gameTiles/terrain/keyDoorTile';
import { TankToggleButtonTile } from '../objects/gameTiles/terrain/tankToggleButtonTile';
import { TeleportTile } from '../objects/gameTiles/terrain/teleportTile';
import { ThiefTile } from '../objects/gameTiles/terrain/thiefTile';
import { ThinWallTile } from '../objects/gameTiles/terrain/thinWallTile';
import { ToggleButtonTile } from '../objects/gameTiles/terrain/toggleButtonTile';
import { ToggleWallTile } from '../objects/gameTiles/terrain/toggleWallTile';
import { TrapButtonTile } from '../objects/gameTiles/terrain/trapButtonTile';
import { TrapTile } from '../objects/gameTiles/terrain/trapTile';
import { WallTile } from '../objects/gameTiles/terrain/wallTile';
import { WaterTile } from '../objects/gameTiles/terrain/waterTile';
import { BlobTile, ParemeciumTile, FireballTile, TeethTile, BugTile, GliderTile, TankTile, WalkerTile, BallTile, BlockTile } from '../objects/mobTile';
import { MapExport, TileExport } from '../static/levels/levelLoading';
import { GameService } from './gameService';

export class MapCreationService
{
    static loadMap(game: Game, levelInfo: MapExport)
    {
        for (var i = 0; i < game.dimensions.width; i++)
        for (var j = 0; j < game.dimensions.height; j++) {
            this.setTileFromId(game, i, j, levelInfo.gameMap[i][j]);
        }
    }

    private static setTileFromId(
        game: Game,
        x: number,
        y: number,
        tile: TileExport
      ): void {
        switch (tile.mob) {
          case 0: GameService.addMob(game, x, y, new BlobTile(Constants.DIRECTION_UP)); break;
          case 1: GameService.addMob(game, x, y, new BlobTile(Constants.DIRECTION_LEFT)); break;
          case 2: GameService.addMob(game, x, y, new BlobTile(Constants.DIRECTION_DOWN)); break;
          case 3: GameService.addMob(game, x, y, new BlobTile(Constants.DIRECTION_RIGHT)); break;
          case 4: GameService.addMob(game, x, y, new ParemeciumTile(Constants.DIRECTION_UP)); break;
          case 5: GameService.addMob(game, x, y, new ParemeciumTile(Constants.DIRECTION_LEFT)); break;
          case 6: GameService.addMob(game, x, y, new ParemeciumTile(Constants.DIRECTION_DOWN)); break;
          case 7: GameService.addMob(game, x, y, new ParemeciumTile(Constants.DIRECTION_RIGHT)); break;
          case 8: GameService.addMob(game, x, y, new FireballTile(Constants.DIRECTION_UP)); break;
          case 9: GameService.addMob(game, x, y, new FireballTile(Constants.DIRECTION_LEFT)); break;
          case 10: GameService.addMob(game, x, y, new FireballTile(Constants.DIRECTION_DOWN)); break;
          case 11: GameService.addMob(game, x, y, new FireballTile(Constants.DIRECTION_RIGHT)); break;
          case 12: GameService.addMob(game, x, y, new TeethTile(Constants.DIRECTION_UP)); break;
          case 13: GameService.addMob(game, x, y, new TeethTile(Constants.DIRECTION_LEFT)); break;
          case 14: GameService.addMob(game, x, y, new TeethTile(Constants.DIRECTION_DOWN)); break;
          case 15: GameService.addMob(game, x, y, new TeethTile(Constants.DIRECTION_RIGHT)); break;
          case 16: GameService.addMob(game, x, y, new BugTile(Constants.DIRECTION_UP)); break;
          case 17: GameService.addMob(game, x, y, new BugTile(Constants.DIRECTION_LEFT)); break;
          case 18: GameService.addMob(game, x, y, new BugTile(Constants.DIRECTION_DOWN)); break;
          case 19: GameService.addMob(game, x, y, new BugTile(Constants.DIRECTION_RIGHT)); break;
          case 20: GameService.addMob(game, x, y, new GliderTile(Constants.DIRECTION_UP)); break;
          case 21: GameService.addMob(game, x, y, new GliderTile(Constants.DIRECTION_LEFT)); break;
          case 22: GameService.addMob(game, x, y, new GliderTile(Constants.DIRECTION_DOWN)); break;
          case 23: GameService.addMob(game, x, y, new GliderTile(Constants.DIRECTION_RIGHT)); break;
          case 24: GameService.addMob(game, x, y, new TankTile(Constants.DIRECTION_UP)); break;
          case 25: GameService.addMob(game, x, y, new TankTile(Constants.DIRECTION_LEFT)); break;
          case 26: GameService.addMob(game, x, y, new TankTile(Constants.DIRECTION_DOWN)); break;
          case 27: GameService.addMob(game, x, y, new TankTile(Constants.DIRECTION_RIGHT)); break;
          case 28: GameService.addMob(game, x, y, new WalkerTile(Constants.DIRECTION_UP)); break;
          case 29: GameService.addMob(game, x, y, new WalkerTile(Constants.DIRECTION_LEFT)); break;
          case 30: GameService.addMob(game, x, y, new WalkerTile(Constants.DIRECTION_DOWN)); break;
          case 31: GameService.addMob(game, x, y, new WalkerTile(Constants.DIRECTION_RIGHT)); break;
          case 32: GameService.addMob(game, x, y, new BallTile(Constants.DIRECTION_UP)); break;
          case 33: GameService.addMob(game, x, y, new BallTile(Constants.DIRECTION_LEFT)); break;
          case 34: GameService.addMob(game, x, y, new BallTile(Constants.DIRECTION_DOWN)); break;
          case 35: GameService.addMob(game, x, y, new BallTile(Constants.DIRECTION_RIGHT)); break;
          case 36: GameService.addMob(game, x, y, new BlockTile(Constants.DIRECTION_UP)); break;
          case 37: GameService.addMob(game, x, y, new BlockTile(Constants.DIRECTION_LEFT)); break;
          case 38: GameService.addMob(game, x, y, new BlockTile(Constants.DIRECTION_DOWN)); break;
          case 39: GameService.addMob(game, x, y, new BlockTile(Constants.DIRECTION_RIGHT)); break;
          default: break;
        }
    
        switch (tile.terrain) {
          case 0: game.tiles[x][y].terrain = new BlankTile(); break;
          case 1: game.tiles[x][y].terrain = new WallTile(); break;
          case 2: game.tiles[x][y].terrain = new ThinWallTile(Constants.TERRAIN_THIN_WALL_UP); break;
          case 3: game.tiles[x][y].terrain = new ThinWallTile(Constants.TERRAIN_THIN_WALL_LEFT); break;
          case 4: game.tiles[x][y].terrain = new ThinWallTile(Constants.TERRAIN_THIN_WALL_DOWN); break;
          case 5: game.tiles[x][y].terrain = new ThinWallTile(Constants.TERRAIN_THIN_WALL_RIGHT); break;
          case 6: game.tiles[x][y].terrain = new ThinWallTile(Constants.TERRAIN_THIN_WALL_DOWN_RIGHT); break;
          case 7: game.tiles[x][y].terrain = new BlankTile(); break;
          case 8: game.tiles[x][y].terrain = new BlankTile(); break;
          case 9: game.tiles[x][y].terrain = new BlankTile(); break;
          case 10: game.tiles[x][y].terrain = new BlankTile(); break;
          case 11: game.tiles[x][y].terrain = new BlankTile(); break;
          case 12: game.tiles[x][y].terrain = new GravelTile(); break;
          case 13: game.tiles[x][y].terrain = new DirtTile(); break;
          case 14: game.tiles[x][y].terrain = new WaterTile(); break;
          case 15: game.tiles[x][y].terrain = new FireTile(); break;
          case 16: game.tiles[x][y].terrain = new BlueWallTile(false); break;
          case 17: game.tiles[x][y].terrain = new ThiefTile(); break;
          case 18: game.tiles[x][y].terrain = new CellBlockTile(); break;
          case 19: game.tiles[x][y].terrain = new CloneMachineTile(); break;
          case 20: game.tiles[x][y].terrain = new KeyDoorTile(Constants.TERRAIN_BLUE_KEY_DOOR); break;
          case 21: game.tiles[x][y].terrain = new KeyDoorTile(Constants.TERRAIN_GREEN_KEY_DOOR); break;
          case 22: game.tiles[x][y].terrain = new KeyDoorTile(Constants.TERRAIN_RED_KEY_DOOR); break;
          case 23: game.tiles[x][y].terrain = new KeyDoorTile(Constants.TERRAIN_YELLOW_KEY_DOOR); break;
          case 24: game.tiles[x][y].terrain = new ForceTile(Constants.DIRECTION_UP); break;
          case 25: game.tiles[x][y].terrain = new ForceTile(Constants.DIRECTION_LEFT); break;
          case 26: game.tiles[x][y].terrain = new ForceTile(Constants.DIRECTION_DOWN); break;
          case 27: game.tiles[x][y].terrain = new ForceTile(Constants.DIRECTION_RIGHT); break;
          case 28: game.tiles[x][y].terrain = new ForceTile(Constants.DIRECTION_RANDOM); break;
          case 29: game.tiles[x][y].terrain = new BlankTile(); break;
          case 30: game.tiles[x][y].terrain = new BlankTile(); break;
          case 31: game.tiles[x][y].terrain = new BlankTile(); break;
          case 32: game.tiles[x][y].terrain = new BlankTile(); break;
          case 33: game.tiles[x][y].terrain = new BlankTile(); break;
          case 34: game.tiles[x][y].terrain = new ToggleWallTile(true); break;
          case 35: game.tiles[x][y].terrain = new ToggleWallTile(false); break;
          case 36: game.tiles[x][y].terrain = new IceTile(Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN); break;
          case 37: game.tiles[x][y].terrain = new IceTile(Constants.TERRAIN_ICE_CORNER_DOWN_LEFT); break;
          case 38: game.tiles[x][y].terrain = new IceTile(Constants.TERRAIN_ICE_CORNER_LEFT_UP); break;
          case 39: game.tiles[x][y].terrain = new IceTile(Constants.TERRAIN_ICE_CORNER_UP_RIGHT); break;
          case 40: game.tiles[x][y].terrain = new IceTile(Constants.TERRAIN_ICE); break;
          case 41: game.tiles[x][y].terrain = new ToggleButtonTile(); break;
          case 42: game.tiles[x][y].terrain = new TankToggleButtonTile(); break;
          case 43: game.tiles[x][y].terrain = new CloneMachineButtonTile(); break;
          case 44: game.tiles[x][y].terrain = new TrapButtonTile(); break;
          case 45: game.tiles[x][y].terrain = new BlankTile(); break;
          case 46: game.tiles[x][y].terrain = new TrapTile(); break;
          case 47: game.tiles[x][y].terrain = new TeleportTile(); break;
          case 48: game.tiles[x][y].terrain = new BlankTile(); break;
          case 49: game.tiles[x][y].terrain = new BlankTile(); break;
          default: break;
        }
    
        switch (tile.spawn) {
          case 0: game.playerSpawn.push(new Coordinates(x, y, game.dimensions.width, game.dimensions.height)); break;
          case 1: game.itemSpawn.push(new Coordinates(x, y, game.dimensions.width, game.dimensions.height)); break;
        }
      }
}