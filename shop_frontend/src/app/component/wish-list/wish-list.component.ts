// wishlist.component.ts
import {Component, OnInit} from '@angular/core';
import {WishlistService} from '../services/wishlist.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  standalone: true,
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: number[] = [];
  email: string | null = null;

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.email = this.authService.get_email_from_token();
    if (this.email) {
      this.loadWishlist();
    }
  }

  loadWishlist() {
    if (!this.email) return;

    this.wishlistService.getWishlist(this.email).subscribe({
      next: (response) => {
        this.wishlistItems = response.wishlist;
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
      }
    });
  }

  removeFromWishlist(itemId: number) {
    if (!this.email) return;

    this.wishlistService.removeFromWishlist(this.email, itemId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(id => id !== itemId);
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
      }
    });
  }
}
