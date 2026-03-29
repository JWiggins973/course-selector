import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <input
        type="text"
        [(ngModel)]="query"
        (ngModelChange)="onSearch($event)"
        placeholder="Search by course ID or title..."
        class="search-input"
      />
    </div>
  `,
  styles: [`
    .search-container {
      width: 100%;
      margin: 20px 0;
    }
    .search-input {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      outline: none;
      box-sizing: border-box;
    }
    /* Highlight border when input is focused */
    .search-input:focus {
      border-color: #4a90e2;
    }
  `]
})
export class SearchBarComponent {

  // Current value of the search input
  query = '';

  // Sends search text up to the parent on every keystroke
  @Output() searchChanged = new EventEmitter<string>();

  // Called on every keystroke — sends current query to parent
  onSearch(value: string) {
    this.searchChanged.emit(value);
  }
}
