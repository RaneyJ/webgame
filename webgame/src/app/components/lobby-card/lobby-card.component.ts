import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lobby-card',
  imports: [],
  templateUrl: './lobby-card.component.html',
  styleUrl: './lobby-card.component.scss'
})
export class LobbyCardComponent {
  @Input() name: string = 'Placeholder';
  lobbyId: number;

  constructor(private router: Router) {
    this.lobbyId = Math.floor(Math.random() * 1000);
  }

  onClick() {
    this.router.navigate(['/lobby'], { queryParams: { id: this.lobbyId } });
  }
}
