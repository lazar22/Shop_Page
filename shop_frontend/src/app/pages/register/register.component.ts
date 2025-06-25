import {AuthService} from "../../services/auth.service";
import {RouterLink} from "@angular/router";
import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  name = '';
  lastname = '';
  email = '';
  password = '';
  c_password = '';

  constructor(private authService: AuthService) {
  }

  try_to_register() {
    if (this.c_password.length > 8 && this.c_password == this.password && this.authService.validate_email(this.email)) {
      const payload = {
        name: this.name,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
      }

      this.authService.register(payload).subscribe({
        next: (res) => console.log(res.message),
        error: (err) => console.error(err.message),
      });
    } else {
      console.error("Failed to register");
    }

  }
}
