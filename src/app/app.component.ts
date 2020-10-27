import { PlayerScore } from 'objects/playerScore';
import { UserInfo } from './models/userInfo';
import { AuthService } from './services/auth.service';
import { MobTile } from './../../objects/mobTile';
import { Player } from './../../objects/player';
import { GameMap } from 'objects/gameMap';
import { MovementService } from './services/movement.service';
import { SocketIOService } from './services/socketio.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from './../../constants/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Room, GAME_ROOMS } from 'objects/room';

declare var PIXI:any;

const terrainTextureList: Map<number, any> = new Map([
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
  [Constants.TERRAIN_ICE_CORNER_UP_RIGHT, PIXI.Texture.from('./../assets/CC_TILE_64_ICE_UP_RIGHT.png')],
  [Constants.TERRAIN_BLUE_KEY_DOOR, PIXI.Texture.from('./../assets/CC_TILE_69_BLUE_KEY_DOOR.png')],
  [Constants.TERRAIN_RED_KEY_DOOR, PIXI.Texture.from('./../assets/CC_TILE_70_RED_KEY_DOOR.png')],
  [Constants.TERRAIN_GREEN_KEY_DOOR, PIXI.Texture.from('./../assets/CC_TILE_71_GREEN_KEY_DOOR.png')],
  [Constants.TERRAIN_YELLOW_KEY_DOOR, PIXI.Texture.from('./../assets/CC_TILE_72_YELLOW_KEY_DOOR.png')],
  [Constants.TERRAIN_THIEF, PIXI.Texture.from('./../assets/CC_TILE_85_THIEF.png')],
  [Constants.TERRAIN_TRAP, PIXI.Texture.from('./../assets/CC_TILE_86_TRAP.png')],
  [Constants.TERRAIN_TRAP_BUTTON, PIXI.Texture.from('./../assets/CC_TILE_87_TRAP_BUTTON.png')],
  [Constants.TERRAIN_TELEPORT, PIXI.Texture.from('./../assets/CC_TILE_88_TELEPORT.png')],
  [Constants.TERRAIN_CLONE_MACHINE, PIXI.Texture.from('./../assets/CC_TILE_89_CLONE_MACHINE.png')],
  [Constants.TERRAIN_CLONE_BUTTON, PIXI.Texture.from('./../assets/CC_TILE_90_CLONE_MACHINE_BUTTON.png')]
]);

const objectTextureList: Map<number, any> = new Map([
  [Constants.OBJECT_CHIP, PIXI.Texture.from('./../assets/CC_TILE_4_CHIP.png')],
  [Constants.OBJECT_BOMB, PIXI.Texture.from('./../assets/CC_TILE_54_BOMB.png')],
  [Constants.OBJECT_BLUE_KEY, PIXI.Texture.from('./../assets/CC_TILE_65_BLUE_KEY.png')],
  [Constants.OBJECT_RED_KEY, PIXI.Texture.from('./../assets/CC_TILE_66_RED_KEY.png')],
  [Constants.OBJECT_GREEN_KEY, PIXI.Texture.from('./../assets/CC_TILE_67_GREEN_KEY.png')],
  [Constants.OBJECT_YELLOW_KEY, PIXI.Texture.from('./../assets/CC_TILE_68_YELLOW_KEY.png')],
  [Constants.OBJECT_FIRE_BOOTS, PIXI.Texture.from('./../assets/CC_TILE_74_FIRE_BOOTS.png')],
  [Constants.OBJECT_FLIPPERS, PIXI.Texture.from('./../assets/CC_TILE_73_FLIPPERS.png')],
  [Constants.OBJECT_ICE_SKATES, PIXI.Texture.from('./../assets/CC_TILE_75_ICE_SKATES.png')],
  [Constants.OBJECT_SUCTION_BOOTS, PIXI.Texture.from('./../assets/CC_TILE_76_SUCTION_BOOTS.png')]
]);

const mobTextureList: Map<number, any> = new Map([
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
  [Constants.MOB_BLOCK, PIXI.Texture.from('./../assets/CC_TILE_60_BLOCK.png')],
  [Constants.MOB_PLAYER_UP_SWIM, PIXI.Texture.from('./../assets/CC_TILE_77_CHIP_UP_SWIM.png')],
  [Constants.MOB_PLAYER_RIGHT_SWIM, PIXI.Texture.from('./../assets/CC_TILE_78_CHIP_RIGHT_SWIM.png')],
  [Constants.MOB_PLAYER_DOWN_SWIM, PIXI.Texture.from('./../assets/CC_TILE_79_CHIP_DOWN_SWIM.png')],
  [Constants.MOB_PLAYER_LEFT_SWIM, PIXI.Texture.from('./../assets/CC_TILE_80_CHIP_LEFT_SWIM.png')],
  [Constants.MOB_OPPONENT_UP_SWIM, PIXI.Texture.from('./../assets/CC_TILE_81_OPPONENT_UP_SWIM.png')],
  [Constants.MOB_OPPONENT_RIGHT_SWIM, PIXI.Texture.from('./../assets/CC_TILE_82_OPPONENT_RIGHT_SWIM.png')],
  [Constants.MOB_OPPONENT_DOWN_SWIM, PIXI.Texture.from('./../assets/CC_TILE_83_OPPONENT_DOWN_SWIM.png')],
  [Constants.MOB_OPPONENT_LEFT_SWIM, PIXI.Texture.from('./../assets/CC_TILE_84_OPPONENT_LEFT_SWIM.png')],
]);

const gameAssets: Map<string, any> = new Map([
  ['SIDE_PANEL', PIXI.Texture.from('./../assets/SIDE_PANEL.png')]
])

export enum MenuState {
  Menu, Login, Playing, Loading, Lobbies, CreateAccount
}

export enum LoginState {
  LoggedIn, LoggedOut, Failed, Banned
}

export enum EmailState {
  Unverified, Verified
}

export enum GameState {
  Starting, Playing, Finished
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public userInfo: UserInfo;

  public loginUsernameForm = new FormControl('', [Validators.required, Validators.maxLength(12)]);
  public loginPasswordForm = new FormControl('', [Validators.required]);

  public usernameForm = new FormControl('', [Validators.required, Validators.maxLength(12)]);
  public passwordForm = new FormControl('', [Validators.required, Validators.maxLength(64)]);
  public confirmPasswordForm = new FormControl('', [Validators.required, Validators.maxLength(64)]);
  public emailForm = new FormControl('', [Validators.email]);

  public loginForm = new FormGroup({
    'username': this.loginUsernameForm,
    'password': this.loginPasswordForm
  });

  public createAccountForm = new FormGroup({
    'username': this.usernameForm,
    'password': this.passwordForm,
    'confirmPassword': this.confirmPasswordForm,
    'email': this.emailForm,
  }, {
    validators: this.passwordsMatch
  });

  public passwordsMatch(group: FormGroup)
  {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  public playing = false;

  public currentPlayer: Player;

  private socketService: SocketIOService;
  private movementService: MovementService;
  private authService: AuthService;

  public app: any = new PIXI.Application(
    (Constants.MAP_VIEW_SIZE * Constants.TILE_SIZE) + Constants.INVENTORY_PIXELS,
    Constants.MAP_VIEW_SIZE * Constants.TILE_SIZE,
    { backgroundColor: 0x999999 }
  );
  public terrainMap: any[][];
  public objectMap: any[][];
  public mobMap: any[][];
  public inventoryGraphic: any[][];
  public leaderboardGraphic: any[];

  public playerList: Player[];

  public roomCountSub: Subscription;
  public currentRoomSub: Subscription;
  public gameMapSub: Subscription;
  public multiLoginSub: Subscription;

  public container = new PIXI.Container();

  public lastCoords: number[];

  public rooms: Room[] = GAME_ROOMS;

  public currentRoom: Room;

  public menuState: MenuState = MenuState.Menu;
  public loginState: LoginState = LoginState.LoggedOut;
  public gameState: GameState = GameState.Starting;

  public MenuStates = MenuState;
  public LoginStates = LoginState;
  public EmailStates = EmailState;
  public GameStates = GameState;

  public timeToStartOrFinish: number;

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
      else if (event.key === Constants.KEY_ENTER)
      {
        switch (this.menuState)
        {
          case MenuState.Login: this.logIntoAccount(); break;
          case MenuState.Menu: this.playGame(); break;
          case MenuState.CreateAccount: this.createAccount(); break;
          case MenuState.Lobbies:
          case MenuState.Playing:
          case MenuState.Loading: break;
        }
      }
    }

  }

  constructor(socketService: SocketIOService, movementService: MovementService, authService: AuthService){
    this.socketService = socketService;
    this.movementService = movementService;
    this.authService = authService;
  }

  ngOnInit(){
    this.menuState = MenuState.Loading;
    if(localStorage.getItem('refresh_token') !== null)
    {
      this.authService.getNewAccessToken()
      .subscribe((res) => {
        localStorage.setItem("access_token", res.accessToken);
        this.loginState = LoginState.LoggedIn;
        this.authService.getInfo().subscribe((res) => {
          this.userInfo = res;
        });
        this.socketService.sendData(Constants.SOCKET_EVENT_LOGIN, localStorage.getItem("access_token"));
        this.menuState = MenuState.Menu;
      }, (err) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.loginState = LoginState.LoggedOut;
        this.menuState = MenuState.Menu;
      });
    }
    else
    {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      this.loginState = LoginState.LoggedOut;
      this.menuState = MenuState.Menu;
      this.userInfo = null;
    }

    document.getElementById('map').appendChild(this.app.view);

    const sidePanel = new PIXI.Sprite(gameAssets.get('SIDE_PANEL'));
    sidePanel.x = Constants.TILE_SIZE * Constants.MAP_VIEW_SIZE;
    sidePanel.y = 0;
    this.app.stage.addChild(sidePanel);

    const leaderboardText = new PIXI.Text('LEADERBOARD', {font:'20px Arial', fill:0xffff00, fontWeight:'bold'});
    leaderboardText.x = Constants.MAP_VIEW_SIZE * Constants.TILE_SIZE + 17;
    leaderboardText.y = 5;
    this.app.stage.addChild(leaderboardText);

    this.leaderboardGraphic = new Array<any>();

    for(let i = 0; i < 6; i++)
    {
      const playerScoreGraphic = new PIXI.Text('', {font:'14px Arial', fill:0xffff00, fontWeight:'normal'});
      playerScoreGraphic.x = Constants.MAP_VIEW_SIZE * Constants.TILE_SIZE + 17;
      playerScoreGraphic.y = 37 + (i * 24);
      this.app.stage.addChild(playerScoreGraphic);
      this.leaderboardGraphic.push(playerScoreGraphic);
    }

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

    this.gameMapSub = this.socketService.getData(Constants.SOCKET_EVENT_UPDATE_GAME_MAP)
      .subscribe((dataString: any) => {
        const data = JSON.parse(dataString);
        if(data.terrain && data.object && data.mobs)
        {
          const gameMap: GameMap = Object.assign(new GameMap(), data.gameMap);
          this.updateMap(data.terrain, data.object, data.mobs);
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
            this.gameState = GameState.Playing
            break;
          case (Constants.GAME_STATUS_NOT_STARTED):
            this.gameState = GameState.Starting
            this.timeToStartOrFinish = data.timer;
            break;
          case (Constants.GAME_STATUS_FINISHED):
            this.gameState = GameState.Finished;
            this.timeToStartOrFinish = data.timer;
            break;
        }
    });

    this.roomCountSub = this.socketService.getData(Constants.SOCKET_EVENT_UPDATE_ROOM_COUNTS)
      .subscribe((dataString: number[]) => {
        for(let i = 0; i < this.rooms.length; i++)
          this.rooms[i].playerCount = dataString[i];
      });

    this.multiLoginSub = this.socketService.getData(Constants.SOCKET_EVENT_MULTILOGIN).subscribe(() => {
      this.logout();
    });

    this.currentRoomSub = this.socketService.getData(Constants.SOCKET_EVENT_UPDATE_CURRENT_ROOM).subscribe((roomNumber: number) => {
      this.currentRoom = this.rooms[roomNumber];
    });
  }

  updateMap(terrainTiles: any[][], objectTiles: any[][], mobTiles: any[][]): void {

    if(this.findPlayer(mobTiles))
      this.lastCoords = this.findPlayer(mobTiles);

    const playerCoords = this.findPlayer(mobTiles) ||
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
              terrainTiles[x][y] === Constants.TERRAIN_WATER ?
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_UP_SWIM) :
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_UP) :
              terrainTiles[x][y] === Constants.TERRAIN_WATER ?
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_UP_SWIM) :
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_UP)
          }
          else if(mobTiles[x][y]?.value === Constants.MOB_PLAYER_DOWN)
          {
            mobTiles[x][y]?.id === this.socketService.getSocketId() ?
              terrainTiles[x][y] === Constants.TERRAIN_WATER ?
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_DOWN_SWIM) :
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_DOWN) :
              terrainTiles[x][y] === Constants.TERRAIN_WATER ?
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_DOWN_SWIM) :
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_DOWN)
          }
          else if(mobTiles[x][y]?.value === Constants.MOB_PLAYER_LEFT)
          {
            mobTiles[x][y]?.id === this.socketService.getSocketId() ?
              terrainTiles[x][y] === Constants.TERRAIN_WATER ?
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_LEFT_SWIM) :
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_LEFT) :
              terrainTiles[x][y] === Constants.TERRAIN_WATER ?
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_LEFT_SWIM) :
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_LEFT)
          }
          else if(mobTiles[x][y]?.value === Constants.MOB_PLAYER_RIGHT)
          {
            mobTiles[x][y]?.id === this.socketService.getSocketId() ?
              terrainTiles[x][y] === Constants.TERRAIN_WATER ?
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_RIGHT_SWIM) :
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_PLAYER_RIGHT) :
              terrainTiles[x][y] === Constants.TERRAIN_WATER ?
                this.mobMap[relativeX][relativeY].texture = mobTextureList.get(Constants.MOB_OPPONENT_RIGHT_SWIM) :
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
          this.objectMap[relativeX][relativeY].texture = objectTextureList.get(objectTiles[x][y]);
        else
          this.objectMap[relativeX][relativeY].texture = null;
        this.terrainMap[relativeX][relativeY].texture = terrainTextureList.get(terrainTiles[x][y]);
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

      this.currentPlayer.inventory.iceSkates === true ?
        this.inventoryGraphic[1][0].texture = objectTextureList.get(Constants.OBJECT_ICE_SKATES) :
        this.inventoryGraphic[1][0].texture = terrainTextureList.get(Constants.TERRAIN_FLOOR);

      this.currentPlayer.inventory.forceBoots === true ?
        this.inventoryGraphic[1][1].texture = objectTextureList.get(Constants.OBJECT_SUCTION_BOOTS) :
        this.inventoryGraphic[1][1].texture = terrainTextureList.get(Constants.TERRAIN_FLOOR);

      this.currentPlayer.inventory.fireBoots === true ?
        this.inventoryGraphic[1][2].texture = objectTextureList.get(Constants.OBJECT_FIRE_BOOTS) :
        this.inventoryGraphic[1][2].texture = terrainTextureList.get(Constants.TERRAIN_FLOOR);

      this.currentPlayer.inventory.flippers === true ?
        this.inventoryGraphic[1][3].texture = objectTextureList.get(Constants.OBJECT_FLIPPERS) :
        this.inventoryGraphic[1][3].texture = terrainTextureList.get(Constants.TERRAIN_FLOOR);
    }
    let thisPlayerInTopFive = false;
    for(let i = 0; i < 6; i++)
    {
      if(this.playerList && this.playerList[i])
      {
        if(i === 5 && !thisPlayerInTopFive)
        {
          const currentPlayer = this.playerList.filter(player => player.id === this.socketService.getSocketId())[0];
          const currentPlayerPosition = this.playerList
            .map(function(player) { return player.id; })
            .indexOf(this.socketService.getSocketId());
          if(currentPlayer)
          {
            this.leaderboardGraphic[i].text =
            (currentPlayerPosition + 1) +
            '. ' +
            (this.playerList[currentPlayerPosition].name?.toLocaleUpperCase() || 'Chip') +
            ' - ' +
            Math.max(0, (Constants.REQUIRED_CHIPS_TO_WIN - this.playerList[currentPlayerPosition].score));
            this.leaderboardGraphic[i].style.fill = 0xffff00;
          }
        }
        else
        {
          this.leaderboardGraphic[i].text =
          (i + 1) +
          '. ' +
          (this.playerList[i].name?.toLocaleUpperCase() || 'Chip') +
          ' - ' +
          Math.max(0, (Constants.REQUIRED_CHIPS_TO_WIN - this.playerList[i].score));
          if (this.playerList[i].id === this.socketService.getSocketId())
          {
            this.leaderboardGraphic[i].style.fill = 0xffff00;
            thisPlayerInTopFive = true;
          }
          else
            this.leaderboardGraphic[i].style.fill = 0xdddd00;
        }
      }
      else
        this.leaderboardGraphic[i].text = '';
    }
  }

  updatePlayerList(playerList: Player[]): void {
    this.playerList = playerList.sort((a, b) => ((a.score < b.score) || (b.winner === true)) ? 1 : -1);

    if (this.playerList.find(player => player.id === this.socketService.getSocketId())?.alive)
      this.menuState = MenuState.Playing;
    else if (this.menuState === MenuState.Playing)
      this.menuState = MenuState.Menu;
  }

  playGame(): void {
    this.menuState = MenuState.Playing;
    this.socketService.sendData(Constants.SOCKET_EVENT_START, this.loginState == LoginState.LoggedIn ? this.userInfo.username : "Chip");
  }

  goToLogin(): void {
    this.menuState = MenuState.Login;
  }

  goToLobbies(): void {
    this.menuState = MenuState.Lobbies;
  }

  goToCreateAccount(): void {
    this.menuState = MenuState.CreateAccount;
  }

  logout(): void {
    this.menuState = MenuState.Loading;
    this.authService.logout().subscribe((res) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      this.loginState = LoginState.LoggedOut;
      this.menuState = MenuState.Menu;
      this.userInfo = null;
    }, (err) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      this.loginState = LoginState.LoggedOut;
      this.menuState = MenuState.Menu;
      this.userInfo = null;
    });
  }

  goToMenu(): void {
    this.menuState = MenuState.Menu;
  }

  logIntoAccount(): void {
    if (this.loginForm.valid)
    {
      this.menuState = MenuState.Loading;
      this.authService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value)
        .subscribe((res) => {
          localStorage.setItem("access_token", res.accessToken);
          localStorage.setItem("refresh_token", res.refreshToken);
          this.loginState = LoginState.LoggedIn;
          this.authService.getInfo().subscribe((res) => {
            this.userInfo = res;
          });
          this.socketService.sendData(Constants.SOCKET_EVENT_LOGIN, localStorage.getItem("access_token"));
          this.menuState = MenuState.Menu;
        }, (err) => {
          this.loginState = LoginState.Failed;
          this.menuState = MenuState.Login;
          this.userInfo = null;
        });
    }
  }

  createAccount(): void {
    if(this.createAccountForm.valid)
    {
      this.menuState = MenuState.Loading;
      this.authService.createAccount(this.usernameForm.value, this.passwordForm.value, this.emailForm.value)
        .subscribe((res) => {
          this.loginUsernameForm.setValue(this.usernameForm.value);
          this.loginPasswordForm.setValue(this.passwordForm.value);
          this.logIntoAccount();
        }, (err) => {
          this.loginState = LoginState.Failed;
          this.menuState = MenuState.CreateAccount;
          this.userInfo = null;
        });
    }
  }

  findPlayer(map: MobTile[][]): number[] {
    for (let x = 0; x < Constants.MAP_SIZE; x++) {
      for (let y = 0; y < Constants.MAP_SIZE; y++) {
        const tile = map[x][y];
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
    return tile?.value === Constants.MOB_PLAYER_UP ||
           tile?.value === Constants.MOB_PLAYER_DOWN ||
           tile?.value === Constants.MOB_PLAYER_RIGHT ||
           tile?.value === Constants.MOB_PLAYER_LEFT;
  }

  joinRoom(roomName: string): void {
    const roomNumber = GAME_ROOMS.map(room => room.name).indexOf(roomName);
    this.socketService.sendData(Constants.SOCKET_EVENT_JOIN_ROOM, roomNumber);
  }
}
