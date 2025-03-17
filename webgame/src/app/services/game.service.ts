import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { WebSocketService } from './websocket.service';
import { LobbyService } from './lobby.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameSubject = new Subject<any>();
  private game: any = {};
  constructor(private router: Router, private webSocketService: WebSocketService, private lobbyService: LobbyService) { 
    this.webSocketService.getMessages().subscribe(message => {
      if (message.type === 'gameUpdated') {
        this.gameSubject.next(message.data);
        this.game = message.data;
      }
    });

  }

  getGames() {
    return this.gameSubject.asObservable();
  }

  getGamesValue() {
    return this.game;
  }

  async sendClick(x: number, y: number) {
    const savedPlayer = JSON.parse(sessionStorage.getItem('player')!);
    let data = {
      player_id: savedPlayer.id,
      x: x,
      y: y,
      game_id: this.lobbyService.getCurrentLobby().id
    }
    console.log("SENDING DATA", data)
    await this.webSocketService.sendMessage({ type: 'actionPixel', data: data }); // Wait for the connection
  }
}
