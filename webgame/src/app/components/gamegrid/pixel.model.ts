export class Pixel {
    constructor(
      public team: number = -1,
      public isInteractable: boolean = Math.random() > 0.2,
      public color: string = isInteractable ? 'lightgray' : 'darkgray'  // Set color based on interactability
    ) {}
  }