import {AuthService} from "../../services/auth.service";
import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {
  }

  // login.component.ts
  login() {
    if (!this.email || !this.password) {
      console.error('Email and password are required');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
}
