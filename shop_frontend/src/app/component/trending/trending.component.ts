import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';

import {ItemComponent} from '../item/item.component';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [
    CommonModule,
    ItemComponent   // ✅ this is required for standalone components
  ],
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent {
  items: any[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<any[]>('assets/items.json').subscribe({
      next: (data) => this.items = data,
      error: (err) => console.error('Failed to load items ', err)
    });
  }
}
