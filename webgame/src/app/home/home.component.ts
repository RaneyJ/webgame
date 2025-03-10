import { Component } from '@angular/core';
import { LobbyCardComponent } from '../components/lobby-card/lobby-card.component';

@Component({
  selector: 'app-home',
  imports: [LobbyCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
