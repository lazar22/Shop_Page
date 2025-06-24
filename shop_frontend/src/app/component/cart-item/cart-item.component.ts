import {CartService} from "../../services/cart.service";
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {Component, Input, Output, EventEmitter} from '@angular/core';
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

  @Output() removed = new EventEmitter<number>();

  get amountOptions(): number[] {
    return Array.from({length: this.stock + 1}, (_, i) => i);
  }

  constructor(
    private cartService: CartService,
    private http: HttpClient
  ) {
  }

  remove_item() {
    this.http.post('http://localhost:4000/cart/remove_item', {
      item_id: this.id,
      price: this.price,
      quantity: this.amount

    }, {responseType: 'json'}).subscribe({
      next: () => {
        console.log('Item removed successfully');
        this.removed.emit(this.id);
        this.cartService.refreshItemCount(this.http);
      },
      error: (err) => console.error('Removing item failed', err)
    });
  }
}
