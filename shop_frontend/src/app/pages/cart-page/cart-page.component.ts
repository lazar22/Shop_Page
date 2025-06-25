import {CartItemComponent} from '../../component/cart-item/cart-item.component'
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgForOf} from "@angular/common";

interface CartItem {
  id: number;
  amount: number;
}

interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  picture: string;
  stock: number;
}

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CartItemComponent,
    NgForOf
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})

export class cart_page {
  cartItems: { item: Item, amount: number }[] = [];

  subtotal!: number;
  shipping_cost: number = 50;
  tax: number = 450;
  order_total!: number;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<CartItem[]>(`http://localhost:4000/cart/get_items`).subscribe(cart => {
      this.http.get<Item[]>('assets/items.json').subscribe(allItems => {
        this.cartItems = cart.map(ci => {
          const item = allItems.find(i => i.id === ci.id);
          if (!item) throw new Error(`Item with ID ${ci.id} not found`);
          return {item, amount: ci.amount};
        });
      });
    });

    this.get_total_price();
  }

  get_total_price(): void {
    this.http.get<{ total: number }>('http://localhost:4000/cart/get_total_price').subscribe(total => {
      this.subtotal = total.total;
      this.order_total = (this.subtotal + this.tax + this.shipping_cost);
    })
  }

  onItemRemoved(removedId: number) {
    this.cartItems = this.cartItems.filter(item => item.item.id !== removedId);
    this.get_total_price();
  }
}
