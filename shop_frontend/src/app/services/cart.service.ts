import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class CartService {
  private itemCount = new BehaviorSubject<number>(0);
  itemCount$ = this.itemCount.asObservable();

  setItemCount(count: number) {
    this.itemCount.next(count);
  }

  refreshItemCount(http: HttpClient) {
    http.get<{ count: number }>('http://localhost:4000/cart/get_item_count').subscribe({
      next: res => this.setItemCount(res.count),
      error: err => console.error('Failed to fetch item count', err)
    });
  }
}
