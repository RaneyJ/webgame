import { Component } from '@angular/core';
import { LobbyCardComponent } from '../components/lobby-card/lobby-card.component';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../services/websocket.service';
import { CommonModule } from '@angular/common';
import { LobbyService } from '../services/lobby.service';

@Component({
  selector: 'app-home',
  imports: [LobbyCardComponent, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  selectedName: string = 'Player'; // Default name
  selectedColor: string = '#ffffff'; // Default color (white)
  id = crypto.randomUUID();
  player = {
    color: this.selectedColor,
    name: this.selectedName,
    id: this.id
  }
  lobbies: any[] = []; // Array to store lobbies
  socketSub: any; // Subscription to WebSocket messages
  constructor(private websocketService: WebSocketService, private lobbyService: LobbyService) {
  }
  
  ngOnInit() {

    this.socketSub = this.websocketService.getMessages().subscribe(message => {
      if (message.type === 'getLobbies') {
        console.log("Lobbies received:", message.data);
        this.lobbies = Object.values(message.data);
      }
    });

    // Load the selected color from session storage when the component initializes
    const savedPlayer = JSON.parse(sessionStorage.getItem('player')!);

    if (savedPlayer) {
      this.selectedColor = savedPlayer.color;
      this.selectedName = savedPlayer.name;
      this.player = savedPlayer;
      this.id = savedPlayer.id;
    }

    this.requestLobbies();
  }

  ngOnDestroy(): void {
    this.socketSub.unsubscribe();
  }

  savePlayer() {
    // Save the selected color to session storage
    sessionStorage.setItem('player', JSON.stringify({
      name: this.selectedName,
      color: this.selectedColor,
      id: this.id
    }));
    const savedPlayer = JSON.parse(sessionStorage.getItem('player')!)
    if(savedPlayer) {
      this.player = savedPlayer
    }
    console.log(this.player)
  }

  async requestLobbies(): Promise<void> {
    try {
      await this.websocketService.sendMessage({ type: 'getLobbies' }); // Wait for the connection
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}
