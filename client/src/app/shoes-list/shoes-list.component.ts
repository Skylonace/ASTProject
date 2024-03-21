import { Component, OnInit, WritableSignal } from '@angular/core';
import { Shoe } from '../shoe';
import { ShoeService } from '../shoe.service';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-shoes-list',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatButtonModule, MatCardModule],
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
        <table mat-table [dataSource]="shoes$()">
          <ng-container matColumnDef="col-name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
          </ng-container>
          <ng-container matColumnDef="col-price">
            <th mat-header-cell *matHeaderCellDef>Precio</th>
            <td mat-cell *matCellDef="let element">{{ element.price }}</td>
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
    'col-name',
    'col-price',
    'col-size',
    'col-color',
    'col-brand',
    'col-stock',
    'col-action',
  ];

  constructor(private shoesService: ShoeService) {}

  ngOnInit() {
    this.fetchShoes();
  }

  deleteShoe(id: string): void {
    this.shoesService.deleteShoe(id).subscribe({
      next: () => this.fetchShoes(),
    });
  }

  private fetchShoes(): void {
    this.shoes$ = this.shoesService.shoes$;
    this.shoesService.getShoes();
  }
}