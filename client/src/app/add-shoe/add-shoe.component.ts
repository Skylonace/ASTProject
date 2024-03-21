import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShoeFormComponent } from '../shoe-form/shoe-form.component';
import { Shoe } from '../shoe';
import { ShoeService } from '../shoe.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-shoe',
  standalone: true,
  imports: [ShoeFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Añadir zapato</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-shoe-form
          (formSubmitted)="addShoe($event)"
        ></app-shoe-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class AddShoeComponent {
  constructor(
    private router: Router,
    private shoeService: ShoeService
  ) {}

  addShoe(shoe: Shoe) {
    this.shoeService.createShoe(shoe).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        alert('Error al añadir zapato');
        console.error(error);
      },
    });
    this.shoeService.getShoes();
  }
}