import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @Input() name: string = 'Placeholder';
  lobbyId: number;
  message: string = ''; // Holds the input message
  messages: string[] = []; // Array to store chat messages

  constructor(private router: Router) {
    this.lobbyId = Math.floor(Math.random() * 1000);
  }

  onClick() {
    this.router.navigate(['/lobby'], { queryParams: { id: this.lobbyId } });
  }

  // Function to send a message
  sendMessage(): void {
    if (this.message.trim() !== "") {
      this.messages.push(this.message);
      this.message = ''; // Clear the input field
    }
  }

  // Optional: Send message on 'Enter' key press
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

}
