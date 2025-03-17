import { Component } from '@angular/core';
import { GameGridV2Component } from '../gamegridv2/gamegridv2.component';
import { GameGridComponent } from '../components/gamegrid/gamegrid.component';
import { WebSocketService } from '../services/websocket.service';
import { GameService } from '../services/game.service';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-game',
  imports: [GameGridComponent, GameGridV2Component],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  public message: string = '';
  public receivedMessage: string = '';
  game: any;
  oldGame: any;
  gameSub: any;
  constructor(private websocketService: WebSocketService, private gameService: GameService) {

  }

  ngOnInit(): void {
    let init = this.gameService.getGamesValue()
    this.updateGame(init)
    this.gameSub = this.gameService.getGames().subscribe(games => {
      this.updateGame(games)
    });
  }

  updateGame(game: any) {
    if(game && (Object.keys(game).length > 0)) {
      if(this.oldGame && (Object.keys(this.oldGame).length) > 0) {
        //If there has been a change to map make copy to trigger change detection
        if(!this.compareObjectsByHash(this.oldGame.pixels, game.pixels)) {
          this.game = {...game};
          this.game.newPixels = this.getNewPixels();
        } else {
          this.game = game;
          this.game.newPixels = [];
        }
      } else {
        this.game = game;
      }
      this.oldGame = {...game};
    } else {
    }
  }

  // Function to hash an object
  hashObject(obj: any) {
    const str = JSON.stringify(obj);  // Serialize the object to a string
    return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex); // Hash and convert to hex
  }

  // Function to compare two objects based on their hashes
  compareObjectsByHash(obj1: any, obj2: any) {
    const hash1 = this.hashObject(obj1);
    const hash2 = this.hashObject(obj2);
    return hash1 === hash2; // Return true if hashes are the same
  }

  getNewPixels() {
    console.log("OLD GAME", this.oldGame)
    let newPixels = [];
    for(let row of this.game.pixels) {
      for(let pixel of row) {
        if(pixel.color !== this.oldGame.pixels[pixel.y][pixel.x].color || pixel.border != this.oldGame.pixels[pixel.y][pixel.x].border) {
          newPixels.push(pixel);
        }
      }
    }
    return newPixels;
  }
    
}
