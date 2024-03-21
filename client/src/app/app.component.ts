import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShoesListComponent } from './shoes-list/shoes-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShoesListComponent, MatToolbarModule],
  styles: [
    `
      main {
        display: flex;
        justify-content: center;
        padding: 2rem 4rem;
      }
    `,
  ],
  template: `
    <mat-toolbar>
      <span>Zapatos</span>
    </mat-toolbar>
    <main>
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  title = 'client';
}