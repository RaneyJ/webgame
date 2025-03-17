import { ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/websocket.service';
import { LobbyService } from '../../services/lobby.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lobby-card',
  imports: [CommonModule],
  templateUrl: './lobby-card.component.html',
  styleUrl: './lobby-card.component.scss'
})
export class LobbyCardComponent {
  @Input() id: number = -1;
  @Input() name: string = 'Placeholder';
  lobbySub: any;
  status: string = '';
  count: number = 0;
  playerId = JSON.parse(sessionStorage.getItem('player')!).id;
  joined: boolean = false;
  constructor(private router: Router, private webSocketService: WebSocketService, private lobbyService: LobbyService, private cdr: ChangeDetectorRef, private zone: NgZone) {
  }

  ngOnInit() {
    console.log(this.id)
    let init = this.lobbyService.getLobbiesValue()
    if(init && init[this.id]) {
      this.count = Object.keys(init[this.id].players).length;
      this.joined = Object.keys(init[this.id].players).includes(this.playerId);
      this.status = init[this.id].status;
    }
    this.lobbySub = this.lobbyService.getLobbies().subscribe(lobbies => {
      if (lobbies && lobbies[this.id]) {
        this.zone.run(() => {
          this.count = Object.keys(lobbies[this.id].players).length;
          this.joined = Object.keys(lobbies[this.id].players).includes(this.playerId);
          this.status = lobbies[this.id].status;
          this.cdr.markForCheck();
        });
      }
    });
  }

  onClick() {
    this.lobbyService.joinLobby(this.id);
  }
  
}
