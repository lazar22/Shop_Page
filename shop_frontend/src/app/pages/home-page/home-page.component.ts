import {Component} from '@angular/core';
import {WelcomeScreenComponent} from "../../component/welcome-screen/welcome-screen.component";
import {TrendingComponent} from "../../component/trending/trending.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    WelcomeScreenComponent,
    TrendingComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class home_page {
  protected title = ' ';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.title = this.route.snapshot.data['title'];
  }
}

export class HomePageComponent {
}
