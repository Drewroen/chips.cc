import { SocketIOService } from './socketio.service';
import { Injectable } from '@angular/core';
import { Constants } from './../../../constants/constants';

@Injectable()
export class MovementService {
  private socketService: SocketIOService

  constructor(socketService: SocketIOService) {
    this.socketService = socketService;
  }

  sendKeyDown(key: number): void {
    this.socketService.sendData(Constants.SOCKET_EVENT_KEYDOWN, key)
  }

  sendKeyUp(key: number): void {
    this.socketService.sendData(Constants.SOCKET_EVENT_KEYUP, key)
  }
}
