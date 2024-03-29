import { Constants } from "./../constants/constants";

export enum RoomType {
  Casual,
  Competitive,
}

export class Room {
  public name: string;
  public type: RoomType;
  public maxPlayerCount: number;
  public playerCount: number;

  constructor(name: string, type: RoomType) {
    this.name = name;
    this.type = type;
    this.maxPlayerCount = Constants.GAME_LOBBY_MAX_SIZE;
    this.playerCount = 0;
  }
}

export const GAME_ROOMS: Room[] = [
  new Room("Rockhopper", RoomType.Competitive),
  new Room("Macaroni", RoomType.Competitive),
  new Room("Emperor", RoomType.Competitive),
  new Room("Galapagos", RoomType.Casual),
  new Room("Gentoo", RoomType.Casual),
  new Room("Snares", RoomType.Casual),
];
