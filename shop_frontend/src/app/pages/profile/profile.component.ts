import {AuthService} from "../../services/auth.service";
import {Component} from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }
}
