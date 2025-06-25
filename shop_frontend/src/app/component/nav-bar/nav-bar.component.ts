import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {CartService} from '../../services/cart.service';
import {DOCUMENT, NgClass, NgIf} from '@angular/common';
import {RouterLink} from "@angular/router";
import {Router} from '@angular/router';

export type Theme = 'light_mode' | 'dark_mode';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterLink,
    NgClass,
    NgIf
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  theme: Theme = 'dark_mode';
  amount_of_items: number = 0;
  isVisible: boolean = false;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.cartService.itemCount$.subscribe(count => {
      this.amount_of_items = count;
    });

    this.cartService.refreshItemCount(this.http);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scroll_top =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const doc_height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll_percent = (scroll_top / doc_height) * 100;

    this.isVisible = scroll_percent <= 60;
  }

  mode_change() {
    const icon = this.document.querySelector(".mode") as HTMLElement;
    const newTheme: Theme = (this.theme === 'dark_mode') ? 'light_mode' : 'dark_mode';

    icon.style.backgroundImage = (newTheme === 'dark_mode') ? ('url("/icons/moon.png")') : ('url("/icons/sun.png")');
    this.document.body.classList.replace(this.theme, newTheme);

    this.theme = newTheme;
  }

  handle_profile_click() {
    if (this.authService.is_logged_in()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
