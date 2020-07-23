import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class SocketIOService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(environment.socketUrl);
  }

  // EMITTER
  sendData(socketEvent: string, data: any) {
    this.socket.emit(socketEvent, data);
  }

  // HANDLER
  getData(socketEvent: string) {
    return Observable.create(observer => {
      this.socket.on(socketEvent, msg => {
        observer.next(msg);
      });
    });
  }

  getSocketId(): string {
    return this.socket.id;
  }
}
