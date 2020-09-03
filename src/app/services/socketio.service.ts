import { Constants } from './../../../constants/constants';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import * as lz from 'lz-string'

@Injectable()
export class SocketIOService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(environment.socketUrl, {transports: ['websocket']});
  }

  sendData(socketEvent: string, data: any) {
    this.socket.emit(socketEvent, data);
  }

  getData(socketEvent: string) {
    return new Observable(observer => {
      this.socket.on(socketEvent, msg => {
        if(socketEvent === Constants.SOCKET_EVENT_UPDATE_GAME_MAP)
          msg = lz.decompress(msg);
        observer.next(msg);
      });
    });
  }

  getSocketId(): string {
    return this.socket.id;
  }
}
