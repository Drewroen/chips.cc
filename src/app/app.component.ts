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
  [Constants.TERRAIN_FINISH, PIXI.Texture.from('./../assets/CC_TILE_7_FINISH.png')]
]);

const objectTextureList: Map<string, any> = new Map([
  [Constants.OBJECT_CHIP, PIXI.Texture.from('./../assets/CC_TILE_4_CHIP.png')]
]);

const mobTextureList: Map<string, any> = new Map([
  [Constants.MOB_PLAYER, PIXI.Texture.from('./../assets/CC_TILE_1_CHIP.png')],
  [Constants.MOB_OPPONENT, PIXI.Texture.from('./../assets/CC_TILE_2_CHIP.png')],
  [Constants.MOB_BALL, PIXI.Texture.from('./../assets/CC_TILE_6_BALL.png')]
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public playerName = new FormControl('');
  public playing = false;

  private socketService: SocketIOService;
  private movementService: MovementService;
  public app: any = new PIXI.Application(
    Constants.MAP_VIEW_SIZE * Constants.TILE_SIZE,
    Constants.MAP_VIEW_SIZE * Constants.TILE_SIZE,
    { backgroundColor: 0x999999 }
  );
  public map: any[][];
  public playerList: Player[];

  public sub: Subscription;

  public container = new PIXI.Container();

  public message: string;

  public lastCoords: number[];

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.movementService.sendMovement(event.key);
  }

  constructor(socketService: SocketIOService, movementService: MovementService){
    this.socketService = socketService;
    this.movementService = movementService;
    this.message = null;
  }

  ngOnInit(){
    const mapPanel = document.getElementById('map').appendChild(this.app.view);

    this.map = new Array<Array<any>>();
    for (let x = 0; x < Constants.MAP_VIEW_SIZE; x++) {
      const row:any[]  = new Array<any>();
      for (let y = 0; y < Constants.MAP_VIEW_SIZE; y++) {
        const tile = new PIXI.Sprite(terrainTextureList.get(Constants.TERRAIN_FLOOR));
        tile.x = (x * Constants.TILE_SIZE);
        tile.y = (y * Constants.TILE_SIZE);
        this.app.stage.addChild(tile);
        row.push(tile);
      }
      this.map.push(row);
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
    const playerCoords = this.findPlayer(gameMap) || this.lastCoords || [Constants.MAP_SIZE / 2, Constants.MAP_SIZE / 2];
    for (let relativeX = 0; relativeX < Constants.MAP_VIEW_SIZE; relativeX++) {
      for (let relativeY = 0; relativeY < Constants.MAP_VIEW_SIZE; relativeY++) {
        const x = (playerCoords[0] + relativeX - Math.floor((Constants.MAP_VIEW_SIZE / 2)) + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        const y = (playerCoords[1] + relativeY - Math.floor((Constants.MAP_VIEW_SIZE / 2)) + Constants.MAP_SIZE) % Constants.MAP_SIZE;
        if(mobTiles[x][y])
        {
          if(mobTiles[x][y]?.value === Constants.MOB_PLAYER)
          {
            mobTiles[x][y]?.id === this.socketService.getSocketId() ?
            this.map[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER) :
            this.map[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT)
          }
          else
          {
            this.map[relativeX][relativeY].texture = mobTextureList.get(mobTiles[x][y].value);
          }
        }
        else if (objectTiles[x][y])
        {
          this.map[relativeX][relativeY].texture = objectTextureList.get(objectTiles[x][y].value);
        }
        else
        {
          this.map[relativeX][relativeY].texture = terrainTextureList.get(terrainTiles[x][y].value);
        }
      }
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
        if (tile && tile.value === Constants.MOB_PLAYER && tile.id === this.socketService.getSocketId())
        {
          return [x, y];
        }
      }
    }
    return null;
  }
}
