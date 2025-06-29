import {BackendHealthService} from '../../services/backend_health_check.service';
import {Component, OnDestroy, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {switchMap, take} from 'rxjs/operators';
import {Subscription, interval} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  countdown = 10;
  private checkInterval = 10000;
  private countdownInterval: any;
  private healthSub: Subscription | null = null;

  constructor(
    private healthService: BackendHealthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startCountdown();
      this.startHealthChecks();
    }
  }

  ngOnDestroy(): void {
    if (this.healthSub) {
      this.healthSub.unsubscribe();
    }
    clearInterval(this.countdownInterval);
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdown = 10;
      }
    }, 1000);
  }

  startHealthChecks(): void {
    this.healthSub = interval(this.checkInterval).pipe(
      switchMap(() => this.healthService.checkBackendHealth().pipe(take(1)))
    ).subscribe({
      next: (healthy: boolean) => {
        if (healthy) {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        // Continue showing maintenance page if health check fails
      }
    });
  }

  retryNow(): void {
    this.healthService.checkBackendHealth().pipe(take(1)).subscribe({
      next: (healthy: boolean) => {
        if (healthy) {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        // Continue showing maintenance page if health check fails
      }
    });
  }
}
