import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatComponent } from '../components/chat/chat.component';
import { LobbyService } from '../services/lobby.service';
import { CommonModule } from '@angular/common';
import { map, Observable, startWith, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-lobby',
  imports: [ChatComponent, CommonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {
  id: number = -1
  lobby = {
    players: {},
    status: '',
    startAt: -1
  };
  players: any[] = [];
  count: number = -1;
  status: string = '';
  startAt: number = -1;
  lobbySub: any;

  countdown$: Observable<number> | undefined;

  playerId = JSON.parse(sessionStorage.getItem('player')!).id;
  constructor(private router: Router, private route: ActivatedRoute, private lobbyService: LobbyService) {
  }

  ngOnInit() {
    // Subscribe to queryParams to get query parameters
    this.route.queryParams.subscribe(params => {
      // Get the 'id' query parameter (replace 'id' with your actual query param name)
      this.id = params['id']; 
    });

    console.log(this.id)
    let init = this.lobbyService.getLobbiesValue()
    this.updateLobby(init)
    this.lobbySub = this.lobbyService.getLobbies().subscribe(lobbies => {
      this.updateLobby(lobbies)
    });

    console.log(this.lobby)
  }

  updateLobby(lobbies: any) {
    if (lobbies && lobbies[this.id]) {
      this.lobby = lobbies[this.id]
      this.count = Object.keys(this.lobby.players).length
      this.status = this.lobby.status;
      this.startAt = this.lobby.startAt;
      this.setPlayers(this.lobby.players);
      if(this.status == 'Starting' && !this.countdown$) {
        this.countdown$ = timer(0, 1000).pipe(
          map(() => {
            // Calculate the time remaining in seconds
            return Math.max(Math.floor((this.startAt - Date.now()) / 1000), 0);
          }),
          takeWhile((remainingTime) => remainingTime > 0)
        );
      } else if(this.status == 'Waiting') {
        this.countdown$ = undefined;
      } else if(this.status == 'In Progress') {
        this.router.navigate(['/game']);
      }
    }
  }

  onClick() {
    this.lobbyService.joinLobby(this.id);
  }

  onBack() {
    this.lobbyService.leaveLobby();
    this.router.navigate(['/']);
  }

  setPlayers(input: any) {
    this.players = [];
    for(let i in input) {
      console.log(i)
      let altered = input[i];
      altered.id = i;
      console.log(altered)
      this.players.push(altered)
    }
  }
}
