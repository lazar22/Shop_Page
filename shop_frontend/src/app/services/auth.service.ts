import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {Observable} from 'rxjs';

interface RegisterPayload {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private key = CryptoJS.enc.Utf8.parse(environment.AES_KEY);
  private iv = CryptoJS.enc.Utf8.parse(environment.AES_IV);

  constructor(private http: HttpClient) {
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

    return this.http.post(`${this.apiUrl}/auth/register`, encrypted_payload, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }
}
