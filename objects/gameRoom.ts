import { Game } from './../objects/game';
import { Room } from './room';

export class GameRoom {
  public game: Game;
  public gameJustCreated: boolean;
  public lastGameImage: string;
  public room: Room;

  constructor(game: Game, room: Room)
  {
    this.game = game;
    this.gameJustCreated = false;
    this.lastGameImage = null;
    this.room = room;
  }
}
