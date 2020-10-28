import { Game } from './../objects/game';
import { Room, RoomType } from './room';

export class GameRoom {
  public game: Game;
  public gameJustCreated: boolean;
  public lastGameImage: string;
  public room: Room;
  public eloCalculated: boolean;

  constructor(game: Game, room: Room)
  {
    this.game = game;
    this.gameJustCreated = false;
    this.lastGameImage = null;
    this.room = room;
    this.eloCalculated = !(this.room.type === RoomType.Competitive);
  }
}
