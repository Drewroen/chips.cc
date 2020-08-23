import { Constants } from '../../constants/constants';
export class RoomInfo {
  roomNumber: number;
  roomCount: number;
  maxCount: number;

  constructor(roomNumber: number)
  {
    this.roomCount = 0;
    this.roomNumber = roomNumber;
    this.maxCount = Constants.GAME_LOBBY_MAX_SIZE;
  }
}
