import {Component} from '@angular/core';
import {WelcomeScreenComponent} from "../../welcome-screen/welcome-screen.component";
import {ItemComponent} from "../../item/item.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    WelcomeScreenComponent,
    ItemComponent,
    NgOptimizedImage
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class home_page {

}
