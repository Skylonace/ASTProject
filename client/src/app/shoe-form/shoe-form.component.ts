import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Shoe } from '../shoe';

@Component({
  selector: 'app-shoe-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
  ],
  styles: `
    .shoe-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-radio-button ~ .mat-mdc-radio-button {
      margin-left: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `,
  template: `
    <form
      class="shoe-form"
      autocomplete="off"
      [formGroup]="shoeForm"
      (submit)="submitForm()"
    >
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input matInput placeholder="Nombre" formControlName="name" required />
        @if (name.invalid) {
        <mat-error>Nombre no permitido</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Precio</mat-label>
        <input
          matInput
          placeholder="Precio"
          formControlName="price"
          required
        />
        @if (price.invalid) {
        <mat-error>Precio no permitido.</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Talla</mat-label>
        <input
          matInput
          placeholder="Talla"
          formControlName="size"
        />
        @if (size.invalid) {
        <mat-error>Talla no permitida.</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Color</mat-label>
        <input
          matInput
          placeholder="Color"
          formControlName="color"
        />
        @if (color.invalid) {
        <mat-error>Color no permitido.</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Marca</mat-label>
        <input
          matInput
          placeholder="Marca"
          formControlName="brand"
        />
        @if (brand.invalid) {
        <mat-error>Marca no permitida.</mat-error>
        }
      </mat-form-field>
      
      <mat-form-field>
        <mat-label>Stock</mat-label>
        <input
          matInput
          placeholder="Stock"
          formControlName="stock"
          required
        />
        @if (stock.invalid) {
        <mat-error>Stock no permitido.</mat-error>
        }
      </mat-form-field>

      <br />
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="shoeForm.invalid"
      >
        Add
      </button>
    </form>
  `,
})
export class ShoeFormComponent {
  initialState = input<Shoe>();

  @Output()
  formValuesChanged = new EventEmitter<Shoe>();

  @Output()
  formSubmitted = new EventEmitter<Shoe>();

  shoeForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?')]],
    size: [''],
    color: [''],
    brand: [''],
    stock: [0, [Validators.required, Validators.pattern('^[0-9]+')]],
  });

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      this.shoeForm.setValue({
        name: this.initialState()?.name || '',
        price: this.initialState()?.price || 0,
        size: this.initialState()?.size || '',
        color: this.initialState()?.color || '',
        brand: this.initialState()?.brand || '',
        stock: this.initialState()?.stock || 0,
      });
    });
  }

  get name() {
    return this.shoeForm.get('name')!;
  }
  get price() {
    return this.shoeForm.get('price')!;
  }
  get size() {
    return this.shoeForm.get('size')!;
  }
  get color() {
    return this.shoeForm.get('color')!;
  }
  get brand() {
    return this.shoeForm.get('brand')!;
  }
  get stock() {
    return this.shoeForm.get('stock')!;
  }

  submitForm() {
    this.formSubmitted.emit(this.shoeForm.value as Shoe);
  }
}