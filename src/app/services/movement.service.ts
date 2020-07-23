import { SocketIOService } from './socketio.service';
import { Injectable } from '@angular/core';
import { Constants } from 'constants/constants';

@Injectable()
export class MovementService {
  private socketService: SocketIOService

  constructor(socketService: SocketIOService) {
    this.socketService = socketService;
  }

  sendMovement(key: string): void {
    this.socketService.sendData(Constants.SOCKET_EVENT_MOVE, key)
  }
}
