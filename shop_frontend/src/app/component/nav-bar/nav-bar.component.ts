import {DOCUMENT} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CartService} from '../../services/cart.service';


export type Theme = 'light_mode' | 'dark_mode';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule  // <-- Add this here
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']  // fix typo here: styleUrls (plural)
})
export class NavBarComponent {
  theme: Theme = 'dark_mode';
  amount_of_items: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cartService: CartService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    // Subscribe to changes in item count
    this.cartService.itemCount$.subscribe(count => {
      this.amount_of_items = count;
    });

    // Initial fetch from backend
    this.cartService.refreshItemCount(this.http);
  }

  mode_change() {
    const icon = this.document.querySelector(".mode") as HTMLElement;
    const newTheme: Theme = (this.theme === 'dark_mode') ? 'light_mode' : 'dark_mode';

    icon.style.backgroundImage = (newTheme === 'dark_mode') ? ('url("/icons/moon.png")') : ('url("/icons/sun.png")');
    this.document.body.classList.replace(this.theme, newTheme);

    this.theme = newTheme;
  }
}
