import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() description!: string;
  @Input() picture!: string;
  @Input() price!: number;
  @Input() amount!: number;
  @Input() stock!: number;

  get amountOptions(): number[] {
    return Array.from({length: this.stock + 1}, (_, i) => i); // [0, 1, 2, ..., stock]
  }
}
