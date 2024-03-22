import { Component, OnInit, WritableSignal, effect, EventEmitter, input, Output } from '@angular/core';
import { Shoe } from '../shoe';
import { ShoeService } from '../shoe.service';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shoes-list',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatButtonModule, MatCardModule, MatFormField, MatLabel, MatInputModule, MatSelect, MatOption, ReactiveFormsModule],
  styles: [
    `
      table {
        width: 100%;
        button:first-of-type {
          margin-right: 1rem;
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Lista de zapatos</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form
          autocomplete="off"
          [formGroup]="filterForm"
          (submit)="filterShoes()"
        >
          <table>
            <td><mat-form-field>
              <mat-label>Filtar</mat-label>
              <input matInput formControlName="filter" placeholder="Filtrar" required />
            </mat-form-field></td>
            <td><mat-form-field>
              <mat-label>Filtrar por</mat-label>
              <mat-select formControlName="filter-by" placeholder="Filtrar por" required>
                <mat-option value="_id">ID</mat-option>
                <mat-option value="name">Nombre</mat-option>
                <mat-option value="size">Talla</mat-option>
                <mat-option value="color">Color</mat-option>
                <mat-option value="brand">Marca</mat-option>
                <mat-option value="stock">Stock</mat-option>
              </mat-select>
            </mat-form-field></td>
            <td>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="filterForm.invalid">
                Filtrar
              </button>
            </td>
          </table>
        </form>
        <table mat-table [dataSource]="shoes$()">
          <ng-container matColumnDef="col-id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{ element._id }}</td>
          </ng-container>
          <ng-container matColumnDef="col-name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
          </ng-container>
          <ng-container matColumnDef="col-price">
            <th mat-header-cell *matHeaderCellDef>Precio</th>
            <td mat-cell *matCellDef="let element">{{ element.price/100 }}</td>
          </ng-container>
          <ng-container matColumnDef="col-size">
            <th mat-header-cell *matHeaderCellDef>Talla</th>
            <td mat-cell *matCellDef="let element">{{ element.size }}</td>
          </ng-container>
          <ng-container matColumnDef="col-color">
            <th mat-header-cell *matHeaderCellDef>Color</th>
            <td mat-cell *matCellDef="let element">{{ element.color }}</td>
          </ng-container>
          <ng-container matColumnDef="col-brand">
            <th mat-header-cell *matHeaderCellDef>Marca</th>
            <td mat-cell *matCellDef="let element">{{ element.brand }}</td>
          </ng-container>
          <ng-container matColumnDef="col-stock">
            <th mat-header-cell *matHeaderCellDef>Stock</th>
            <td mat-cell *matCellDef="let element">{{ element.stock }}</td>
          </ng-container>
          <ng-container matColumnDef="col-action">
            <th mat-header-cell *matHeaderCellDef>Action</th>
            <td mat-cell *matCellDef="let element">
              <button mat-raised-button [routerLink]="['edit/', element._id]">
                Editar
              </button>
              <button
                mat-raised-button
                color="warn"
                (click)="deleteShoe(element._id || '')"
              >
                Borrar
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" [routerLink]="['new']">
          Añadir zapato
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class ShoesListComponent implements OnInit {
  shoes$ = {} as WritableSignal<Shoe[]>;
  displayedColumns: string[] = [
    'col-id',
    'col-name',
    'col-price',
    'col-size',
    'col-color',
    'col-brand',
    'col-stock',
    'col-action',
  ];
  
  filterForm = this.formBuilder.group({
    filter: ['', Validators.required],
    'filter-by': ['id', Validators.required],
  });

  constructor(private shoesService: ShoeService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.fetchShoes();
  }

  deleteShoe(id: string): void {
    this.shoesService.deleteShoe(id).subscribe({
      next: () => this.fetchShoes(),
    });
  }

  filterShoes(): void {
    this.shoesService.searchShoes(this.filterForm.value.filter, this.filterForm.value['filter-by']);
  }

  private fetchShoes(): void {
    this.shoes$ = this.shoesService.shoes$;
    this.shoesService.getShoes();
  }
}