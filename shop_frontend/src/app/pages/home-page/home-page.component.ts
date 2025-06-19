import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {WelcomeScreenComponent} from "../../component/welcome-screen/welcome-screen.component";
import {TrendingComponent} from "../../component/trending/trending.component";
import {ItemComponent} from "../../component/item/item.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    WelcomeScreenComponent,
    ItemComponent,
    NgOptimizedImage,
    TrendingComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class home_page {

}
