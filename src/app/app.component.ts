import { MobTile } from './../../objects/mobTile';
import { Player } from './../../objects/player';
import { GameMap } from 'objects/gameMap';
import { MovementService } from './services/movement.service';
import { SocketIOService } from './services/socketio.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from 'constants/constants';
import { FormControl } from '@angular/forms';
import { Game } from 'objects/game';

declare var PIXI:any;

const terrainTextureList: Map<string, any> = new Map([
  [Constants.TERRAIN_FLOOR, PIXI.Texture.from('./../assets/CC_TILE_0_EMPTY.png')],
  [Constants.TERRAIN_WALL, PIXI.Texture.from('./../assets/CC_TILE_3_WALL.png')],
  [Constants.TERRAIN_WATER, PIXI.Texture.from('./../assets/CC_TILE_5_WATER.png')],
  [Constants.TERRAIN_FINISH, PIXI.Texture.from('./../assets/CC_TILE_7_FINISH.png')],
  [Constants.TERRAIN_SOCKET, PIXI.Texture.from('./../assets/CC_TILE_8_SOCKET.png')],
  [Constants.TERRAIN_FORCE_UP, PIXI.Texture.from('./../assets/CC_TILE_9_FORCE_UP.png')],
  [Constants.TERRAIN_FORCE_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_10_FORCE_RIGHT.png')],
  [Constants.TERRAIN_FORCE_DOWN, PIXI.Texture.from('./../assets/CC_TILE_11_FORCE_DOWN.png')],
  [Constants.TERRAIN_FORCE_LEFT, PIXI.Texture.from('./../assets/CC_TILE_12_FORCE_LEFT.png')],
  [Constants.TERRAIN_FORCE_RANDOM, PIXI.Texture.from('./../assets/CC_TILE_36_FORCE_RANDOM.png')],
  [Constants.TERRAIN_ICE, PIXI.Texture.from('./../assets/CC_TILE_13_ICE.png')],
  [Constants.TERRAIN_TOGGLE_WALL_CLOSED, PIXI.Texture.from('./../assets/CC_TILE_32_TOGGLE_WALL_CLOSED.png')],
  [Constants.TERRAIN_TOGGLE_WALL_OPEN, PIXI.Texture.from('./../assets/CC_TILE_33_TOGGLE_WALL_OPEN.png')],
  [Constants.TERRAIN_TOGGLE_BUTTON, PIXI.Texture.from('./../assets/CC_TILE_34_TOGGLE_BUTTON.png')],
  [Constants.TERRAIN_BLUE_WALL_FAKE, PIXI.Texture.from('./../assets/CC_TILE_35_BLUE_WALL.png')],
  [Constants.TERRAIN_BLUE_WALL_REAL, PIXI.Texture.from('./../assets/CC_TILE_35_BLUE_WALL.png')],
  [Constants.TERRAIN_FIRE, PIXI.Texture.from('./../assets/CC_TILE_45_FIRE.png')],
  [Constants.TERRAIN_THIN_WALL_UP, PIXI.Texture.from('./../assets/CC_TILE_46_THIN_WALL_UP.png')],
  [Constants.TERRAIN_THIN_WALL_LEFT, PIXI.Texture.from('./../assets/CC_TILE_47_THIN_WALL_LEFT.png')],
  [Constants.TERRAIN_THIN_WALL_DOWN, PIXI.Texture.from('./../assets/CC_TILE_48_THIN_WALL_DOWN.png')],
  [Constants.TERRAIN_THIN_WALL_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_49_THIN_WALL_RIGHT.png')],
  [Constants.TERRAIN_THIN_WALL_DOWN_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_50_THIN_WALL_DOWN_RIGHT.png')],
  [Constants.TERRAIN_DIRT, PIXI.Texture.from('./../assets/CC_TILE_52_DIRT.png')],
  [Constants.TERRAIN_GRAVEL, PIXI.Texture.from('./../assets/CC_TILE_51_GRAVEL.png')],
  [Constants.TERRAIN_CELL_BLOCK, PIXI.Texture.from('./../assets/CC_TILE_53_CELL_BLOCK.png')],
  [Constants.TERRAIN_TANK_TOGGLE_BUTTON, PIXI.Texture.from('./../assets/CC_TILE_59_TANK_BUTTON.png')],
  [Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN, PIXI.Texture.from('./../assets/CC_TILE_61_ICE_RIGHT_DOWN.png')],
  [Constants.TERRAIN_ICE_CORNER_DOWN_LEFT, PIXI.Texture.from('./../assets/CC_TILE_62_ICE_DOWN_LEFT.png')],
  [Constants.TERRAIN_ICE_CORNER_LEFT_UP, PIXI.Texture.from('./../assets/CC_TILE_63_ICE_LEFT_UP.png')],
  [Constants.TERRAIN_ICE_CORNER_UP_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_64_ICE_UP_RIGHT.png')]
]);

const objectTextureList: Map<string, any> = new Map([
  [Constants.OBJECT_CHIP, PIXI.Texture.from('./../assets/CC_TILE_4_CHIP.png')],
  [Constants.OBJECT_BOMB, PIXI.Texture.from('./../assets/CC_TILE_54_BOMB.png')],
  [Constants.OBJECT_BLUE_KEY, PIXI.Texture.from('./../assets/CC_TILE_65_BLUE_KEY.png')],
  [Constants.OBJECT_RED_KEY, PIXI.Texture.from('./../assets/CC_TILE_66_RED_KEY.png')],
  [Constants.OBJECT_GREEN_KEY, PIXI.Texture.from('./../assets/CC_TILE_67_GREEN_KEY.png')],
  [Constants.OBJECT_YELLOW_KEY, PIXI.Texture.from('./../assets/CC_TILE_68_YELLOW_KEY.png')]
]);

const mobTextureList: Map<string, any> = new Map([
  [Constants.MOB_PLAYER_UP, PIXI.Texture.from('./../assets/CC_TILE_37_CHIP_UP.png')],
  [Constants.MOB_PLAYER_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_38_CHIP_RIGHT.png')],
  [Constants.MOB_PLAYER_DOWN, PIXI.Texture.from('./../assets/CC_TILE_39_CHIP_DOWN.png')],
  [Constants.MOB_PLAYER_LEFT, PIXI.Texture.from('./../assets/CC_TILE_40_CHIP_LEFT.png')],
  [Constants.MOB_OPPONENT_UP, PIXI.Texture.from('./../assets/CC_TILE_41_OPPONENT_UP.png')],
  [Constants.MOB_OPPONENT_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_42_OPPONENT_RIGHT.png')],
  [Constants.MOB_OPPONENT_DOWN, PIXI.Texture.from('./../assets/CC_TILE_43_OPPONENT_DOWN.png')],
  [Constants.MOB_OPPONENT_LEFT, PIXI.Texture.from('./../assets/CC_TILE_44_OPPONENT_LEFT.png')],
  [Constants.MOB_BALL, PIXI.Texture.from('./../assets/CC_TILE_6_BALL.png')],
  [Constants.MOB_FIREBALL, PIXI.Texture.from('./../assets/CC_TILE_14_FIREBALL.png')],
  [Constants.MOB_GLIDER_UP, PIXI.Texture.from('./../assets/CC_TILE_15_GLIDER_UP.png')],
  [Constants.MOB_GLIDER_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_16_GLIDER_RIGHT.png')],
  [Constants.MOB_GLIDER_DOWN, PIXI.Texture.from('./../assets/CC_TILE_17_GLIDER_DOWN.png')],
  [Constants.MOB_GLIDER_LEFT, PIXI.Texture.from('./../assets/CC_TILE_18_GLIDER_LEFT.png')],
  [Constants.MOB_WALKER_UP_DOWN, PIXI.Texture.from('./../assets/CC_TILE_19_WALKER_UP_DOWN.png')],
  [Constants.MOB_WALKER_LEFT_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_20_WALKER_LEFT_RIGHT.png')],
  [Constants.MOB_PAREMECIUM_UP_DOWN, PIXI.Texture.from('./../assets/CC_TILE_21_PAREMECIUM_UP_DOWN.png')],
  [Constants.MOB_PAREMECIUM_LEFT_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_22_PAREMECIUM_LEFT_RIGHT.png')],
  [Constants.MOB_BUG_UP, PIXI.Texture.from('./../assets/CC_TILE_23_BUG_UP.png')],
  [Constants.MOB_BUG_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_24_BUG_RIGHT.png')],
  [Constants.MOB_BUG_DOWN, PIXI.Texture.from('./../assets/CC_TILE_25_BUG_DOWN.png')],
  [Constants.MOB_BUG_LEFT, PIXI.Texture.from('./../assets/CC_TILE_26_BUG_LEFT.png')],
  [Constants.MOB_BLOB, PIXI.Texture.from('./../assets/CC_TILE_27_BLOB.png')],
  [Constants.MOB_TEETH_UP, PIXI.Texture.from('./../assets/CC_TILE_28_TEETH_UP.png')],
  [Constants.MOB_TEETH_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_29_TEETH_RIGHT.png')],
  [Constants.MOB_TEETH_DOWN, PIXI.Texture.from('./../assets/CC_TILE_30_TEETH_DOWN.png')],
  [Constants.MOB_TEETH_LEFT, PIXI.Texture.from('./../assets/CC_TILE_31_TEETH_LEFT.png')],
  [Constants.MOB_TANK_UP, PIXI.Texture.from('./../assets/CC_TILE_55_TANK_UP.png')],
  [Constants.MOB_TANK_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_56_TANK_RIGHT.png')],
  [Constants.MOB_TANK_DOWN, PIXI.Texture.from('./../assets/CC_TILE_57_TANK_DOWN.png')],
  [Constants.MOB_TANK_LEFT, PIXI.Texture.from('./../assets/CC_TILE_58_TANK_LEFT.png')],
  [Constants.MOB_BLOCK, PIXI.Texture.from('./../assets/CC_TILE_60_BLOCK.png')]
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public playerName = new FormControl('');
  public playing = false;

  public currentPlayer: Player;

  private socketService: SocketIOService;
  private movementService: MovementService;
  public app: any = new PIXI.Application(
    (Constants.MAP_VIEW_SIZE * Constants.TILE_SIZE) + Constants.INVENTORY_PIXELS,
    Constants.MAP_VIEW_SIZE * Constants.TILE_SIZE,
    { backgroundColor: 0x999999 }
  );
  public terrainMap: any[][];
  public objectMap: any[][];
  public mobMap: any[][];
  public inventoryGraphic: any[][];

  public playerList: Player[];

  public sub: Subscription;

  public container = new PIXI.Container();

  public message: string;

  public lastCoords: number[];

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.type === 'keyup')
    {
      if (event.key === Constants.KEY_UP_ARROW)
        this.movementService.sendKeyUp(Constants.DIRECTION_UP);
      else if (event.key === Constants.KEY_DOWN_ARROW)
        this.movementService.sendKeyUp(Constants.DIRECTION_DOWN);
      else if (event.key === Constants.KEY_RIGHT_ARROW)
        this.movementService.sendKeyUp(Constants.DIRECTION_RIGHT);
      else if (event.key === Constants.KEY_LEFT_ARROW)
        this.movementService.sendKeyUp(Constants.DIRECTION_LEFT);
    }
    else if (event.type === 'keydown')
    {
      if (event.key === Constants.KEY_UP_ARROW)
        this.movementService.sendKeyDown(Constants.DIRECTION_UP);
      else if (event.key === Constants.KEY_DOWN_ARROW)
        this.movementService.sendKeyDown(Constants.DIRECTION_DOWN);
      else if (event.key === Constants.KEY_RIGHT_ARROW)
        this.movementService.sendKeyDown(Constants.DIRECTION_RIGHT);
      else if (event.key === Constants.KEY_LEFT_ARROW)
        this.movementService.sendKeyDown(Constants.DIRECTION_LEFT);
    }

  }

  constructor(socketService: SocketIOService, movementService: MovementService){
    this.socketService = socketService;
    this.movementService = movementService;
    this.message = null;
  }

  ngOnInit(){
    const mapPanel = document.getElementById('map').appendChild(this.app.view);

    this.terrainMap = new Array<Array<any>>();
    this.objectMap = new Array<Array<any>>();
    this.mobMap = new Array<Array<any>>();
    this.inventoryGraphic = new Array<Array<any>>();

    for (let x = 0; x < Constants.MAP_VIEW_SIZE; x++) {
      const terrainRow: any[]  = new Array<any>();
      const objectRow: any[] = new Array<any>();
      const mobRow: any[] = new Array<any>();
      for (let y = 0; y < Constants.MAP_VIEW_SIZE; y++) {
        const tileX = x * Constants.TILE_SIZE;
        const tileY = y * Constants.TILE_SIZE;
        const mobTile = new PIXI.Sprite();
        const objectTile = new PIXI.Sprite();
        const terrainTile = new PIXI.Sprite(terrainTextureList.get(Constants.TERRAIN_FLOOR));
        terrainTile.x = tileX;
        terrainTile.y = tileY;
        objectTile.x = tileX;
        objectTile.y = tileY;
        mobTile.x = tileX;
        mobTile.y = tileY;
        this.app.stage.addChild(terrainTile);
        this.app.stage.addChild(objectTile);
        this.app.stage.addChild(mobTile);

        terrainRow.push(terrainTile);
        objectRow.push(objectTile);
        mobRow.push(mobTile);
      }
      this.terrainMap.push(terrainRow);
      this.objectMap.push(objectRow);
      this.mobMap.push(mobRow);
    }

    for(let i = 0; i < 2; i++)
    {
      const inventoryRow: any[] = new Array<any>();
      for(let j = 0; j < 4; j++)
      {
        const inventoryTile = new PIXI.Sprite(terrainTextureList.get(Constants.TERRAIN_FLOOR));
        const tileX = Constants.INVENTORY_TILES_X + (Constants.TILE_SIZE * j);
        const tileY = Constants.INVENTORY_TILES_Y + (Constants.TILE_SIZE * i);
        inventoryTile.x = tileX;
        inventoryTile.y = tileY;
        this.app.stage.addChild(inventoryTile);
        inventoryRow.push(inventoryTile);
      }
      this.inventoryGraphic.push(inventoryRow);
    }

    this.sub = this.socketService.getData(Constants.SOCKET_EVENT_UPDATE_GAME_MAP)
      .subscribe((data: Game) => {
        if(data.gameMap)
        {
          const gameMap: GameMap = Object.assign(new GameMap(), data.gameMap);
          this.updateMap(gameMap);
        }
        const playerList: Player[] = new Array<Player>();
        for(const tempPlayer of data.players)
        {
          const player: Player = Object.assign(new Player(null, null), tempPlayer);
          playerList.push(player);
          if(player.id === this.socketService.getSocketId())
            this.currentPlayer = player;
        }
        this.updatePlayerList(playerList);
        switch(data.gameStatus) {
          case (Constants.GAME_STATUS_PLAYING):
            this.message = null;
            break;
          case (Constants.GAME_STATUS_NOT_STARTED):
            this.message = 'Starting in ' + (Math.floor(data.startingTimer / 60)) + '...';
            break;
          case (Constants.GAME_STATUS_FINISHED):
            this.message = 'Good game! Restarting in ' + (Math.floor(data.finishTimer / 60)) + '...';
        }

    });
  }

  updateMap(gameMap: GameMap): void {
    const terrainTiles = gameMap.terrainTiles;
    const objectTiles = gameMap.objectTiles;
    const mobTiles = gameMap.mobTiles;

    if(this.findPlayer(gameMap))
      this.lastCoords = this.findPlayer(gameMap);

    const playerCoords = this.findPlayer(gameMap) ||
                         this.lastCoords ||
                         [Math.floor(Constants.MAP_SIZE / 2), Math.floor(Constants.MAP_SIZE / 2)];
    for (let relativeX = 0; relativeX < Constants.MAP_VIEW_SIZE; relativeX++) {
      for (let relativeY = 0; relativeY < Constants.MAP_VIEW_SIZE; relativeY++) {
        const x = (playerCoords[0] + relativeX - Math.floor((Constants.MAP_VIEW_SIZE / 2)) + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        const y = (playerCoords[1] + relativeY - Math.floor((Constants.MAP_VIEW_SIZE / 2)) + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        if(mobTiles[x][y])
        {
          if(mobTiles[x][y]?.value === Constants.MOB_PLAYER_UP)
          {
            mobTiles[x][y]?.id === this.socketService.getSocketId() ?
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_UP) :
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_UP)
          }
          else if(mobTiles[x][y]?.value === Constants.MOB_PLAYER_DOWN)
          {
            mobTiles[x][y]?.id === this.socketService.getSocketId() ?
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_DOWN) :
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_DOWN)
          }
          else if(mobTiles[x][y]?.value === Constants.MOB_PLAYER_LEFT)
          {
            mobTiles[x][y]?.id === this.socketService.getSocketId() ?
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_LEFT) :
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_LEFT)
          }
          else if(mobTiles[x][y]?.value === Constants.MOB_PLAYER_RIGHT)
          {
            mobTiles[x][y]?.id === this.socketService.getSocketId() ?
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_RIGHT) :
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_RIGHT)
          }
          else
          {
            this.mobMap[relativeX][relativeY].texture = mobTextureList.get(mobTiles[x][y].value);
          }
        }
        else
        {
          this.mobMap[relativeX][relativeY].texture = null;
        }
        if (objectTiles[x][y])
          this.objectMap[relativeX][relativeY].texture = objectTextureList.get(objectTiles[x][y].value);
        else
          this.objectMap[relativeX][relativeY].texture = null;
        this.terrainMap[relativeX][relativeY].texture = terrainTextureList.get(terrainTiles[x][y].value);
      }
    }
    if (this.currentPlayer)
    {
      this.currentPlayer.inventory.redKeys > 0 ?
        this.inventoryGraphic[0][0].texture = objectTextureList.get(Constants.OBJECT_RED_KEY) :
        this.inventoryGraphic[0][0].texture = terrainTextureList.get(Constants.TERRAIN_FLOOR);

      this.currentPlayer.inventory.blueKeys > 0 ?
        this.inventoryGraphic[0][1].texture = objectTextureList.get(Constants.OBJECT_BLUE_KEY) :
        this.inventoryGraphic[0][1].texture = terrainTextureList.get(Constants.TERRAIN_FLOOR);

      this.currentPlayer.inventory.yellowKeys > 0 ?
        this.inventoryGraphic[0][2].texture = objectTextureList.get(Constants.OBJECT_YELLOW_KEY) :
        this.inventoryGraphic[0][2].texture = terrainTextureList.get(Constants.TERRAIN_FLOOR);

      this.currentPlayer.inventory.greenKey === true ?
        this.inventoryGraphic[0][3].texture = objectTextureList.get(Constants.OBJECT_GREEN_KEY) :
        this.inventoryGraphic[0][3].texture = terrainTextureList.get(Constants.TERRAIN_FLOOR);
    }
  }

  updatePlayerList(playerList: Player[]): void {
    this.playerList = playerList.sort((a, b) => (a.score < b.score) ? 1 : -1);

    this.playing = this.playerList.find(player => player.id === this.socketService.getSocketId())?.alive;
  }

  playGame(): void {
    this.socketService.sendData(Constants.SOCKET_EVENT_START, this.playerName.value);
  }

  findPlayer(map: GameMap): number[] {
    for (let x = 0; x < Constants.MAP_SIZE; x++) {
      for (let y = 0; y < Constants.MAP_SIZE; y++) {
        const tile = map.getMobTile(x, y);
        if (tile && this.tileIsPlayer(tile) && tile.id === this.socketService.getSocketId())
        {
          return [x, y];
        }
      }
    }
    return null;
  }

  private tileIsPlayer(tile: MobTile)
  {
    return tile.value === Constants.MOB_PLAYER_UP ||
           tile.value === Constants.MOB_PLAYER_DOWN ||
           tile.value === Constants.MOB_PLAYER_RIGHT ||
           tile.value === Constants.MOB_PLAYER_LEFT;
  }
}
