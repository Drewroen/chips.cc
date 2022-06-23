import { GameService } from '../services/gameService';
import { Constants } from "./../constants/constants";
import { Game } from "./../objects/game";
import { LastGameImages } from "./lastGameImages";
import { Room, RoomType } from "./room";

export class GameRoom {
  public game: Game;
  public hasInitialized: boolean;
  public gameJustCreated: boolean;
  public lastGameImage: string;
  public lastGameImages: LastGameImages;
  public room: Room;
  public eloCalculated: boolean;
  public levels: any[];

  constructor(room: Room, levels: any[]) {
    this.levels = levels;
    this.game = this.getNewGameLevel();
    this.hasInitialized = false;
    this.gameJustCreated = false;
    this.lastGameImages = new LastGameImages();
    this.room = room;
    this.eloCalculated = !(this.room.type === RoomType.Competitive);
  }

  gameHasNotStarted(): boolean {
    return this.game.gameStatus === Constants.GAME_STATUS_NOT_STARTED;
  }

  gameIsHappening(): boolean {
    return this.game.gameStatus === Constants.GAME_STATUS_PLAYING;
  }

  gameHasEnded(): boolean {
    return this.game.gameStatus === Constants.GAME_STATUS_FINISHED;
  }

  gameWasJustCreated(): boolean {
    return this.gameJustCreated;
  }

  startGame() {
    this.game.gameStatus = Constants.GAME_STATUS_PLAYING;
    this.game.timer = Constants.GAMEPLAY_TIMER;
  }

  initializeRoom() {
    this.hasInitialized = true;
  }

  endRoom() {
    this.hasInitialized = false;
    this.game.gameStatus = Constants.GAME_STATUS_NOT_STARTED;
    this.game.timer = Constants.START_AND_FINISH_TIMER;
    this.game = this.getNewGameLevel();
    this.eloCalculated = !(this.room.type === RoomType.Competitive);
  }

  readyToInitialize(): boolean {
    return this.game.players.length > 0;
  }

  private getNewGameLevel(): Game {
    return new Game(
      this.levels[Math.floor(Math.random() * this.levels.length)]
    );
  }
}
