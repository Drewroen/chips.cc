import { SocketIOService } from './services/SocketIOService';
import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

declare var PIXI:any;

const textureList: any = [
  PIXI.Texture.from('./../assets/CC_TILE_0_EMPTY.png'),
  PIXI.Texture.from('./../assets/CC_TILE_1_CHIP.png'),
  PIXI.Texture.from('./../assets/CC_TILE_2_CHIP.png')
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private socketService: SocketIOService;
  public app: any;
  public map: any[][];
  public sub: Subscription;

  public container = new PIXI.Container();

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        this.socketService.sendData('movement', { direction: 'down' });
      break;
      case 'ArrowUp':
        this.socketService.sendData('movement', { direction: 'up' });
      break;
      case 'ArrowLeft':
        this.socketService.sendData('movement', { direction: 'left' });
      break;
      case 'ArrowRight':
        this.socketService.sendData('movement', { direction: 'right' });
      break;
    }
  }

  constructor(socketService: SocketIOService){
    this.socketService = socketService;
  }

  ngOnInit(){
    this.app = new PIXI.Application(640, 640, { backgroundColor: 0x999999 });
    const mapPanel = document.getElementById('map').appendChild(this.app.view);

    this.map = new Array<Array<any>>();
    for (let x = 0; x < 20; x++) {
      const row:any[]  = new Array<any>();
      for (let y = 0; y < 20; y++) {
        const tile = new PIXI.Sprite(textureList[0]);
        tile.x = (x * 32);
        tile.y = (y * 32);
        this.app.stage.addChild(tile);
        row.push(tile);
      }
      this.map.push(row);
    }

    this.sub = this.socketService.getData('updateGame')
      .subscribe(data => {
        this.updateMap(data);
    });
  }

  updateMap(gameMap: any): void {
    const tiles = gameMap.gameMap.tiles;
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
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
    this.socketService.sendData('start', null);
  }
}

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}
