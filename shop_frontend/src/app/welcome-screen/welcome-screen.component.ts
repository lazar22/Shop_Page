import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.css'
})
export class WelcomeScreenComponent {

    protected readonly name = 'My Shop';
}
