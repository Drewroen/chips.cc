import { MovementService } from './services/movement.service';
import { SocketIOService } from './services/socketio.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../constants/constants'

declare var PIXI:any;

const textureList: any = [
  PIXI.Texture.from('./../assets/CC_TILE_0_EMPTY.png'),
  PIXI.Texture.from('./../assets/CC_TILE_1_CHIP.png'),
  PIXI.Texture.from('./../assets/CC_TILE_2_CHIP.png'),
  PIXI.Texture.from('./../assets/CC_TILE_3_WALL.png')
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private socketService: SocketIOService;
  private movementService: MovementService;
  public app: any;
  public map: any[][];
  public sub: Subscription;

  public container = new PIXI.Container();

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.movementService.sendMovement(event.key);
  }

  constructor(socketService: SocketIOService, movementService: MovementService){
    this.socketService = socketService;
    this.movementService = movementService;
  }

  ngOnInit(){
    this.app = new PIXI.Application(Constants.MAP_SIZE * Constants.TILE_SIZE, Constants.MAP_SIZE * Constants.TILE_SIZE, { backgroundColor: 0x999999 });
    const mapPanel = document.getElementById('map').appendChild(this.app.view);

    this.map = new Array<Array<any>>();
    for (let x = 0; x < Constants.MAP_SIZE; x++) {
      const row:any[]  = new Array<any>();
      for (let y = 0; y < Constants.MAP_SIZE; y++) {
        const tile = new PIXI.Sprite(textureList[0]);
        tile.x = (x * Constants.TILE_SIZE);
        tile.y = (y * Constants.TILE_SIZE);
        this.app.stage.addChild(tile);
        row.push(tile);
      }
      this.map.push(row);
    }

    this.sub = this.socketService.getData(Constants.SOCKET_EVENT_UPDATE_GAME_MAP)
      .subscribe(data => {
        this.updateMap(data);
    });
  }

  updateMap(gameMap: any): void {
    const tiles = gameMap.gameMap.tiles;
    for (let x = 0; x < Constants.MAP_SIZE; x++) {
      for (let y = 0; y < Constants.MAP_SIZE; y++) {
        if(tiles[x][y].value === 1)
        {
          if (this.socketService.getSocketId() === tiles[x][y].playerId)
          {
            this.map[x][y].texture = textureList[1];
          }
          else
          {
            this.map[x][y].texture = textureList[2];
          }
        }
        else
        {
          this.map[x][y].texture = textureList[tiles[x][y].value];
        }
      }
    }
  }

  playGame(): void {
    this.socketService.sendData(Constants.SOCKET_EVENT_START, null);
  }
}
