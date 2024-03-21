import { Routes } from '@angular/router';
import { ShoesListComponent } from './shoes-list/shoes-list.component';

export const routes: Routes = [
  { path: 'admin', component: ShoesListComponent, title: 'Lista de zapatos' },
];