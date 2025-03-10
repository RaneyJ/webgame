import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameGridComponent } from './gamegrid.component';

describe('GameGridComponent', () => {
  let component: GameGridComponent;
  let fixture: ComponentFixture<GameGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
