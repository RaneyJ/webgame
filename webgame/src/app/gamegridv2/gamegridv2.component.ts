import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pixel } from './pixel.model';
import { Team } from './team.model';
import { GameService } from '../services/game.service';

@Component({
  selector: 'game-gridv2',
  imports: [CommonModule],
  templateUrl: './gamegridv2.component.html',
  styleUrl: './gamegridv2.component.scss'
})
export class GameGridV2Component implements OnInit {
  @Input() game: any;
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D | null;

  private tickInterval: any;
  private tickrate: number = 600;
  zoomLevel: number = 1;  // Initial zoom level (1 is normal)

  pixelSize = 10; 
  canvasWidth = 1000 * this.pixelSize;
  canvasHeight = 1000 * this.pixelSize;

  points: number = 0;
  playerId = JSON.parse(sessionStorage.getItem('player')!).id;
  teams: { [playerID: string]: Team } = {};
  pixels: Pixel[][]= [];
  offsetX: number = 0;
  offsetY: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  moved: boolean = false; // Track movement to differentiate drag vs click

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.teams[this.playerId] = {
      id: this.playerId,
      color: '#B00B13',
      points: 0,
    }

    window.addEventListener('wheel', this.onWheelScroll.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['game']) {
      if(this.game && this.game.players) {
        this.points = this.game.players[this.playerId].points;
      }
      if(this.game && this.game.pixels && this.game.newPixels) {
        for(let pixel of this.game.newPixels) {
          console.log(pixel)
          console.log("DRAWING", pixel, pixel.x, pixel.y)
          this.drawPixel(pixel.x, pixel.y);
        }
      } else {
        console.log("DRAWING ALL PIXELS", this.game)
        this.drawPixels();
      }
    }
  }
  
  ngAfterViewInit() {
    this.setupCanvas();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    window.removeEventListener('wheel', this.onWheelScroll.bind(this));
  }

  setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', (event) => this.startDrag(event));
    canvas.addEventListener('mousemove', (event) => this.dragMap(event));
    canvas.addEventListener('mouseup', (event) => this.stopDrag(event));
    canvas.addEventListener('click', (event) => this.onPixelClick(event));
  }

  drawPixels() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.save();

    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.zoomLevel, this.zoomLevel);

    for (let row of this.game.pixels) {
      for (let pixel of row) {
        let color = pixel.color;
        if(pixel.border) {
          color = pixel.borderColor;
        }
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
          pixel.x * this.pixelSize, 
          pixel.y * this.pixelSize, 
          this.pixelSize, 
          this.pixelSize
        );
      }
    }

    this.ctx.restore();
  }

  drawPixel(x: number, y: number) {
    if (!this.ctx) return;
    
    const pixel = this.game.pixels[y][x]; // Get the updated pixel
    let color = pixel.color;
    if(pixel.border) {
      color = pixel.borderColor;
    }
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      pixel.x * this.pixelSize, 
      pixel.y * this.pixelSize, 
      this.pixelSize, 
      this.pixelSize
    );
  }

  zoomIn(): void {
    if (this.zoomLevel <= 1.5) {
      this.zoomLevel += 0.1;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel >= 0.11) {
      this.zoomLevel -= 0.1;
    }
  }

  onWheelScroll(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else if (event.deltaY > 0) {
      this.zoomOut();
    }
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.moved = false; // Reset movement flag
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  dragMap(event: MouseEvent): void {
    if (this.isDragging) {
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        this.moved = true; // Mark movement if significant
      }

      this.offsetX += dx;
      this.offsetY += dy;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  }

  stopDrag(event: MouseEvent): void {
    this.isDragging = false;

    if (!this.moved) {
      //this.onPixelClick(event);
    }
  }

  onPixelClick(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
  
    // Step 1: Get the mouse coordinates relative to the canvas (considering the viewport's offset)
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
  
    // Step 2: Adjust for the zoom level (mouse coordinates should be scaled by zoom level)
    const canvasX = mouseX / this.zoomLevel;
    const canvasY = mouseY / this.zoomLevel;
  
    // Step 3: Adjust for panning (offsets due to dragging the map)
    const x = Math.floor((canvasX) / this.pixelSize);
    const y = Math.floor((canvasY) / this.pixelSize);
  
    this.gameService.sendClick(x, y);
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
  
}
