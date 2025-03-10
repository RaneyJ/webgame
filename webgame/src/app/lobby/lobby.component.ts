import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatComponent } from '../components/chat/chat.component';

@Component({
  selector: 'app-lobby',
  imports: [ChatComponent],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {
  lobbyId: number | undefined = undefined;
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Subscribe to queryParams to get query parameters
    this.route.queryParams.subscribe(params => {
      // Get the 'id' query parameter (replace 'id' with your actual query param name)
      this.lobbyId = params['id']; 
    });
  }

  onBack() {
    this.router.navigate(['/']);
  }
}
