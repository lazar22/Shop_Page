import {WishlistService} from '../../services/wishlist.service';
import {AuthService} from '../../services/auth.service';
import {CartService} from '../../services/cart.service';
import {NgOptimizedImage} from "@angular/common";
import {HttpClient} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent implements OnInit {
  @Input() title!: string;
  @Input() description!: string;
  @Input() id!: number;
  @Input() price!: number;
  @Input() picture!: string;

  is_in_wishlist: boolean = false;
  private email: string | null = null;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.email = this.authService.get_email_from_token();
    this.check_wishlist_status();

    if (this.email) {
      this.loadWishlist();
    }
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

  loadWishlist(): void {
    this.wishlistService.getWishlist(this.email!).subscribe({
      next: (response) => {
        this.is_in_wishlist = response.wishlist.includes(this.id);
      },
      error: (err) => console.error('Error loading wishlist:', err)
    });
  }

  check_wishlist_status(): void {
    if (!this.email) return;

    this.wishlistService.getWishlist(this.email).subscribe({
      next: (response) => {
        this.is_in_wishlist = response.wishlist.includes(this.id);
      },
      error: (err) => {
        console.error("Error checking wishlist status: " + err);
      }
    });
  }

  toggle_wishlist(): void {
    if (!this.email) {
      this.router.navigate(['/login']);
      return;
    }

    const wishlistButton = document.querySelector('.wishlist') as HTMLElement;
    if (wishlistButton) wishlistButton.style.pointerEvents = 'none';

    const operation = this.is_in_wishlist
      ? this.wishlistService.removeFromWishlist(this.email!, this.id)
      : this.wishlistService.addToWishlist(this.email!, this.id);

    operation.subscribe({
      next: () => {
        this.is_in_wishlist = !this.is_in_wishlist;
        console.log(`Item ${this.is_in_wishlist ? 'added to' : 'removed from'} wishlist successfully`);
      },
      error: (err) => {
        console.error('Wishlist operation failed:', err);
      },
      complete: () => {
        if (wishlistButton) wishlistButton.style.pointerEvents = 'auto';
      }
    });
  }
}
