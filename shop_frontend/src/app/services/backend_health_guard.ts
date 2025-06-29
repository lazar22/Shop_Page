import {BackendHealthService} from './backend_health_check.service';
import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class BackendHealthGuard implements CanActivate {
  constructor(
    private healthService: BackendHealthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  canActivate(): Observable<boolean | UrlTree> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(true);
    }

    return this.healthService.checkBackendHealth().pipe(
      map(isHealthy => isHealthy || this.router.createUrlTree(['/maintenance'])),
      catchError(() => of(this.router.createUrlTree(['/maintenance'])))
    );
  }
}
