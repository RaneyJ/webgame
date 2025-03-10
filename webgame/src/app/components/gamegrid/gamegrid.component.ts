import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pixel } from './pixel.model';
import { Team } from './team.model';

@Component({
  selector: 'game-grid',
  imports: [CommonModule],
  templateUrl: './gamegrid.component.html',
  styleUrl: './gamegrid.component.scss'
})
export class GameGridComponent implements OnInit{
  pixels: Pixel[][] = Array.from({ length: 50 }, () =>
    Array(50).fill(null).map(() => new Pixel())  // Create a new Pixel instance for each element
  );
  teams: { [playerID: string]: Team } = {};
  playerId: number = 1; // This should be dynamically set based on the logged-in player
  points: number = 0;

  private tickInterval: any;
  private tickrate: number = 600;

  zoomLevel: number = 1;  // Initial zoom level (1 is normal)
  offsetX: number = 0;
  offsetY: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  startY: number = 0;

  clickTimeout: any;

  onPixelClick(row: number, col: number): void {
    console.log(this.isDragging)
    if (this.isDragging) {
      return;
    }
    let color = this.teams[this.playerId].color;
    const pixel = this.pixels[row][col];
    if (pixel.isInteractable && this.points >= 10 && pixel.team !== this.playerId) {
      // Set the pixel color to the desired color
      pixel.color = color;
      this.points -= 10; // Deduct points for the action
      this.pixels[row][col].team =  this.playerId; // This 1 value should be the player's team
      console.log(`Pixel clicked at [${row}, ${col}], color set to ${color}`);
    } else {
      console.log(`Pixel at [${row}, ${col}] is not interactable.`);
    }
  }

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.teams[this.playerId] = {
      id: this.playerId,
      color: '#B00B13',
      points: 0,
    }
    this.points = this.teams[this.playerId].points;
    this.tickInterval = setInterval(() => {
      this.points += 1;  // Gain 1 point every tick (second)
    }, this.tickrate);  // 1000 ms = 1 second

    window.addEventListener('wheel', this.onWheelScroll.bind(this))
  }

  ngOnDestroy(): void {
    // Restore body scroll when the component is destroyed
    document.body.style.overflow = '';

    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    window.removeEventListener('wheel', this.onWheelScroll.bind(this));
  }

  zoomIn(): void {
    this.zoomLevel += 0.1;  // Increase zoom level
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {  // Prevent zooming out too much
      this.zoomLevel -= 0.1;  // Decrease zoom level
    }
  }

  onWheelScroll(event: WheelEvent): void {
    // Prevent the default scroll behavior (page scroll)
    event.preventDefault();
    console.log("HERE")
    if (event.deltaY < 0) {
      // Scroll up -> Zoom in
      this.zoomIn();
    } else if (event.deltaY > 0) {
      // Scroll down -> Zoom out
      this.zoomOut();
    }
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    event.stopImmediatePropagation();
    console.log("START", this.isDragging)
  }

  dragMap(event: MouseEvent): void {
    if (this.isDragging) {
      this.offsetX += event.clientX - this.startX;
      this.offsetY += event.clientY - this.startY;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  }

  stopDrag(): void {
    this.isDragging = false;
    console.log("STOP", this.isDragging)
  }

  handlePixelMouseDown(event: MouseEvent, row: number, col: number): void {
    // Set timeout to delay pixel click check
    this.clickTimeout = setTimeout(() => {
      // After the delay, check if drag has started
      if (!this.isDragging) {
        this.onPixelClick(row, col); // Trigger the pixel click
      }
    }, 100);

    // Immediately prevent the click behavior if the drag starts
    if (this.isDragging) {
      clearTimeout(this.clickTimeout); // Clear any pending click timeout if drag starts
    }
  }
}
