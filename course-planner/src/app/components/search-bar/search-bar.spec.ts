import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SearchBarComponent } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => vi.useRealTimers());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('input starts empty', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('emits searchChanged after the debounce delay', () => {
    vi.useFakeTimers();
    const emitted: string[] = [];
    component.searchChanged.subscribe((v: string) => emitted.push(v));

    component.searchControl.setValue('CSCI');
    vi.advanceTimersByTime(150);

    expect(emitted).toEqual(['CSCI']);
  });

  it('emits an empty string when the input is cleared', () => {
    vi.useFakeTimers();
    const emitted: string[] = [];
    component.searchChanged.subscribe((v: string) => emitted.push(v));

    component.searchControl.setValue('CSCI');
    vi.advanceTimersByTime(150);
    component.searchControl.setValue('');
    vi.advanceTimersByTime(150);

    expect(emitted).toEqual(['CSCI', '']);
  });
});
