import { Constants } from '../../constants/constants';
export class RoomInfo {
  roomName: string;
  roomNumber: number;
  roomCount: number;
  maxCount: number;

  constructor(roomName: string)
  {
    this.roomCount = 0;
    this.roomName = roomName;
    this.maxCount = Constants.GAME_LOBBY_MAX_SIZE;
  }
}
