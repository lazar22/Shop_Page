import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {isPlatformBrowser} from "@angular/common";
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import CryptoJS from 'crypto-js';

interface RegisterPayload {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
  iss: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private key = CryptoJS.enc.Utf8.parse(environment.AES_KEY);
  private iv = CryptoJS.enc.Utf8.parse(environment.AES_IV);
  private current_token = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformID: Object) {
    if (isPlatformBrowser(this.platformID)) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.current_token.next(token);
      }
    }
  }

  private get_local_storage(): Storage | null {
    if (isPlatformBrowser(this.platformID)) {
      return localStorage;
    }
    return null;
  }

  encrypt(txt: string): string {
    const encrypted = CryptoJS.AES.encrypt(txt, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  register(payload: RegisterPayload): Observable<any> {
    const encrypted_payload = {
      name: payload.name,
      lastname: payload.lastname,
      email: this.encrypt(payload.email),
      password: this.encrypt(payload.password),
    }

    return new Observable(observer => {
      return this.http.post(`${this.apiUrl}/auth/register`, encrypted_payload).subscribe({
        next: (res) => {
          this.router.navigate(['/']);
          observer.next(res);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      })
    })
  }

  login(email: string, password: string): Observable<any> {
    const encrypted_payload = {
      email: this.encrypt(email),
      password: this.encrypt(password),
    }

    return new Observable(observer => {
      return this.http.post(`${this.apiUrl}/auth/login`, encrypted_payload).subscribe({
        next: (res: any) => {
          if (res.token) {
            this.store_token(res.token);
            this.router.navigate(['/']);
          }
          observer.next(res);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      })
    })
      ;
  }

  store_token(token: string): void {
    localStorage.setItem('auth_token', token);
    this.current_token.next(token);
  }

  get_token(): string | null {
    return this.current_token.value;
  }

  is_logged_in(): boolean {
    const token = this.get_token();
    if (!token) {
      return false;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.current_token.next(null);
    this.router.navigate(['/']);
  }

  get_email_from_token(): string | null {
    const token = this.get_token();
    if (!token) {
      return null;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.email;
    } catch {
      return null;
    }
  }

  validate_email(_email: string) {
    return String(_email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
}
