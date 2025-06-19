import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WelcomeScreenComponent} from "./welcome-screen/welcome-screen.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WelcomeScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Shop Page';
  name = 'My Store';
}
