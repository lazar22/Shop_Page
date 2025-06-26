import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser, NgClass} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthService} from "../../services/auth.service";
import {CartService} from '../../services/cart.service';
import {RouterLink} from "@angular/router";
import {Router} from '@angular/router';

export type Theme = 'light_mode' | 'dark_mode';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  theme: Theme = 'dark_mode';
  amount_of_items: number = 0;
  isVisible: boolean = true;
  is_browser: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {
    this.is_browser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.cartService.itemCount$.subscribe(count => {
      this.amount_of_items = count;
    });

    this.cartService.refreshItemCount(this.http);

    if (this.is_browser) {
      this.checkInitialVisibility();
      setTimeout(() => this.checkScrollableContent(), 0);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.is_browser) {
      this.checkScrollableContent();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.is_browser) {
      this.updateVisibility();
    }
  }

  private checkInitialVisibility() {
    this.isVisible = true;
  }

  private checkScrollableContent() {
    if (!this.is_browser) return;

    const hasScrollableContent = this.document.documentElement.scrollHeight >
      this.document.documentElement.clientHeight;

    if (!hasScrollableContent) {
      this.isVisible = true;
    }
  }

  private updateVisibility() {
    if (!this.is_browser) return;

    const scroll_top = window.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;

    const doc_height = this.document.documentElement.scrollHeight -
      this.document.documentElement.clientHeight;

    if (doc_height > 0) {
      const scroll_percent = (scroll_top / doc_height) * 100;
      this.isVisible = scroll_percent <= 60;
    } else {
      this.isVisible = true;
    }
  }

  mode_change() {
    if (!this.is_browser) return;

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
