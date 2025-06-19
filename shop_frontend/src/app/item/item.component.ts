import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() picture!: string;
}
