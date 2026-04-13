import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="search-container">
      <input
        type="text"
        [formControl]="searchControl"
        placeholder="Search by course ID or title..."
        aria-label="Search courses"
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
      border: 2px solid var(--border);
      border-radius: 8px;
      outline: none;
      box-sizing: border-box;
      background: var(--bg-card);
      color: var(--text-primary);
    }
    .search-input:focus {
      border-color: var(--accent);
    }
  `]
})
export class SearchBarComponent {

  searchControl = new FormControl('');

  @Output() searchChanged = new EventEmitter<string>();

  constructor() {
    // Emits only after the user stops typing for 150ms and the value has changed
    this.searchControl.valueChanges.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(value => this.searchChanged.emit(value ?? ''));
  }
}
