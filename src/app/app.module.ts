import { AuthService } from './services/auth.service';
import { MovementService } from './services/movement.service';
import { SocketIOService } from './services/socketio.service';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ReactiveFormsModule } from '@angular/forms';

const config: SocketIoConfig = {
  url: environment.socketUrl,
  // options: {
  //   transports: ['websocket']
  // }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    SocketIOService,
    MovementService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
