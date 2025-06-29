import {BackendHealthService} from '../app/services/backend_health_check.service';
import {NavBarComponent} from "./component/nav-bar/nav-bar.component";
import {Router, RouterOutlet, NavigationEnd} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {filter} from "rxjs";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {
  title = 'Shop Page';
  name: string = 'My Shop';

  constructor(
    private healthService: BackendHealthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    // Check backend health on initial load
    this.checkBackendHealth();

    // Also check when navigation ends (in case we're coming back from maintenance)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/maintenance') {
        this.checkBackendHealth();
      }
    });
  }

  private checkBackendHealth() {
    this.healthService.checkBackendHealth().subscribe(healthy => {
      if (!healthy && this.router.url !== '/maintenance') {
        this.router.navigate(['/maintenance']);
      } else if (healthy && this.router.url === '/maintenance') {
        this.router.navigate(['/']);
      }
    });
  }
}

export var NAME = 'My Shop';
