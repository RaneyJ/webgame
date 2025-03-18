// websocket.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  private messageSubject = new Subject<any>();
  private connectionPromise: Promise<void>;

  constructor() {
    // Create the WebSocket connection
    this.socket = new WebSocket('https://server.pixelplunder.net'); // Replace with your WebSocket server URL

    // Connection open promise
    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket.onopen = () => {
        console.log('WebSocket connection opened');
        resolve(); // Resolve the promise when the connection is open
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error); // Reject the promise on error
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    });

    // Listen for incoming messages
    this.socket.onmessage = (event) => {
      this.messageSubject.next(JSON.parse(event.data)); // Assuming the server sends JSON
    };
  }

  // Wait for the connection to open before sending a message
  async sendMessage(message: any) {
    console.log("QUEUED")
    await this.connectionPromise; // Wait until the connection is open
    console.log("SENT")
    this.socket.send(JSON.stringify(message));
  }

  // Get observable to subscribe to incoming messages
  getMessages() {
    return this.messageSubject.asObservable();
  }
}
