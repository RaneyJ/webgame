import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Default route
    { path: 'lobby', component: LobbyComponent },
    { path: 'game', component: GameComponent }
];
