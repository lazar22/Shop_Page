import {CartService} from '../../services/cart.service';
import {HttpClientModule} from '@angular/common/http';
import {NgOptimizedImage} from "@angular/common";
import {HttpClient} from '@angular/common/http';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgOptimizedImage,
    HttpClientModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})

export class ItemComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() id!: number;
  @Input() price!: number;
  @Input() picture!: string;

  constructor(
    private cartService: CartService,
    private http: HttpClient
  ) {
  }

  add_item(): void {
    this.http.post('http://localhost:4000/cart/add', {
      item_id: this.id,
      price: this.price,
      quantity: 1
    }, {responseType: 'json'})
      .subscribe({
        next: () => console.log('Item added successfully'),
        error: (err) => console.error('Add item failed', err)
      });

    this.cartService.refreshItemCount(this.http);
  }
}
