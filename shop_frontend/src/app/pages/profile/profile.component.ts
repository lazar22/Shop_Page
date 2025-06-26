import {PrevBuyComponent} from "../../component/prev-buy/prev-buy.component";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Component} from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PrevBuyComponent,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  protected title: string = "";

  constructor(private authService: AuthService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.title = this.route.snapshot.data['title'];
  }

  logout() {
    this.authService.logout();
  }
}
