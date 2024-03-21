import { Component, OnInit, WritableSignal } from '@angular/core';
import { ShoeFormComponent } from '../shoe-form/shoe-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Shoe } from '../shoe';
import { ShoeService } from '../shoe.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-shoe',
  standalone: true,
  imports: [ShoeFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Editar zapato</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-shoe-form
          [initialState]="shoe()"
          (formSubmitted)="editShoe($event)"
        ></app-shoe-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class EditShoeComponent implements OnInit {
  shoe = {} as WritableSignal<Shoe>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shoeService: ShoeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }

    this.shoeService.getShoe(id!);
    this.shoe = this.shoeService.shoe$;
  }

  editShoe(shoe: Shoe) {
    this.shoeService
      .updateShoe(this.shoe()._id || '', shoe)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          alert('Error al editar zapato');
          console.error(error);
        },
      });
  }
}