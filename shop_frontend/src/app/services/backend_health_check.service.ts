import {environment} from "../../environments/environment";
import {HttpClient} from '@angular/common/http';
import {catchError, map, timeout} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendHealthService {
  private apiUrl = environment.apiUrl;
  private check_timeout = 3000;

  constructor(private http: HttpClient) {
  }

  checkBackendHealth(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/health`, {responseType: 'text'}).pipe(
      timeout(this.check_timeout),
      map(() => true),
      catchError(() => of(false))
    );
  }
}
