import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  private lobbySubject = new Subject<any>();
  private lobbies: any = {};
  constructor(private router: Router, private webSocketService: WebSocketService) { 
    this.webSocketService.getMessages().subscribe(message => {
      if (message.type === 'joinLobby') {
        console.log(message)
        if(message.data >= 0) {
          this.router.navigate(['/lobby'], { queryParams: { id: message.data } });
        }
      }
      if (message.type === 'lobbiesUpdated') {
        console.log(message)
        this.lobbySubject.next(message.data);
        this.lobbies = message.data;
      }
      if (message.type === 'getLobbies') {
        console.log("HERE:", message.data);
        this.lobbySubject.next(message.data);
        this.lobbies = message.data;
      }
    });

  }

  async joinLobby(id: number): Promise<void> {
    try {
      const savedPlayer = JSON.parse(sessionStorage.getItem('player')!);
      let data = {
        id: id,
        name: savedPlayer.name,
        color: savedPlayer.color,
        player_id: savedPlayer.id
      }
      console.log(data)
      await this.webSocketService.sendMessage({ type: 'joinLobby', data: data }); // Wait for the connection
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  async leaveLobby() {
    await this.webSocketService.sendMessage({ type: 'leaveLobby', data: '' }); // Wait for the connection
  }

  getLobbies() {
    return this.lobbySubject.asObservable();
  }

  getLobbiesValue() {
    return this.lobbies;
  }

  getCurrentLobby() {
    for(let lobby in this.lobbies) {
      if(this.lobbies[lobby].players && this.lobbies[lobby].players[JSON.parse(sessionStorage.getItem('player')!).id]) {
        return this.lobbies[lobby];
      }
    }
  }
}
