// wishlist.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  addToWishlist(email: string, itemId: number) {
    return this.http.post(`${this.apiUrl}/wishlist/add`, {email, item_id: itemId}, {
      responseType: 'text'
    });
  }

  removeFromWishlist(email: string, itemId: number) {
    return this.http.post(`${this.apiUrl}/wishlist/remove`, {email, item_id: itemId}, {
      responseType: 'text'
    });
  }

  getWishlist(email: string) {
    return this.http.post<{ wishlist: number[] }>(`${this.apiUrl}/wishlist/get`, {email});
  }
}
