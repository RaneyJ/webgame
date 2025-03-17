import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameGridV2Component } from './gamegridv2.component';

describe('GameGridV2Component', () => {
  let component: GameGridV2Component;
  let fixture: ComponentFixture<GameGridV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameGridV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameGridV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
