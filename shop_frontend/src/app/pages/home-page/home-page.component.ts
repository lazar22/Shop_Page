import { Component } from '@angular/core';
import {WelcomeScreenComponent} from "../../welcome-screen/welcome-screen.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    WelcomeScreenComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class home_page {

}
