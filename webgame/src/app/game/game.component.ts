import { Component } from '@angular/core';
import { GameGridComponent } from '../components/gamegrid/gamegrid.component';

@Component({
  selector: 'app-game',
  imports: [GameGridComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

}
