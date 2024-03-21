import { Routes } from '@angular/router';
import { ShoesListComponent } from './shoes-list/shoes-list.component';
import { AddShoeComponent } from './add-shoe/add-shoe.component';
import { EditShoeComponent } from './edit-shoe/edit-shoe.component';

export const routes: Routes = [
  { path: 'admin', component: ShoesListComponent, title: 'Lista de zapatos' },
  { path: 'admin/new', component: AddShoeComponent },
  { path: 'admin/edit/:id', component: EditShoeComponent },
];