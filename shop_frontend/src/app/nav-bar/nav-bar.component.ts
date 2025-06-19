import {DOCUMENT} from '@angular/common';
import {Component, HostListener, Inject, Renderer2} from '@angular/core';

export type Theme = 'light_mode' | 'dark_mode';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
  theme: Theme = 'dark_mode';

  constructor(@Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2) {
  }

  mode_change() {
    const icon = document.querySelector(".mode") as HTMLElement;
    const newTheme: Theme = (this.theme === 'dark_mode') ? 'light_mode' : 'dark_mode';

    icon.style.backgroundImage = (newTheme === 'dark_mode') ? ('url("/icons/moon.png")') : ('url("/icons/sun.png")');
    this.document.body.classList.replace(this.theme, newTheme);

    this.theme = newTheme;
  }
}
