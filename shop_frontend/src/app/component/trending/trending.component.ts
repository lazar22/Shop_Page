import {Component} from '@angular/core';
import {ItemComponent} from "../item/item.component";

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [
    ItemComponent
  ],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.css'
})
export class TrendingComponent {

}
