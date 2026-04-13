import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app';

const FIXTURE_CSV = `courseId,title,prereqs,description
MATH100,Calculus I,,Intro to calculus
CSCI100,Intro to CS,,Programming fundamentals
CSCI200,Data Structures,CSCI100,Arrays trees and graphs`;

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushCourses() {
    httpMock.expectOne('courses.csv').flush(FIXTURE_CSV);
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    flushCourses();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    flushCourses();
    await fixture.whenStable();
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1') as HTMLElement;
    expect(h1.textContent).toContain('Course Planner');
  });

  it('should show search bar when no course is selected', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    flushCourses();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-search-bar')).toBeTruthy();
  });

  it('should hide search bar when a course is selected', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    flushCourses();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.onCourseSelected(
      fixture.componentInstance.allCourses[0]
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-search-bar')).toBeNull();
  });

  it('should show course cards after a matching search', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    flushCourses();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.onSearch('CSCI');
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-course-card');
    expect(cards.length).toBe(2); // CSCI100 and CSCI200
  });

  it('should clear cards when search query is empty', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    flushCourses();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.onSearch('CSCI');
    fixture.detectChanges();
    fixture.componentInstance.onSearch('');
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-course-card');
    expect(cards.length).toBe(0);
  });

  it('should show detail view when a course is selected', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    flushCourses();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.onCourseSelected(
      fixture.componentInstance.allCourses[0]
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-course-detail')).toBeTruthy();
  });

  it('should return to search view when back is triggered', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    flushCourses();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.onCourseSelected(
      fixture.componentInstance.allCourses[0]
    );
    fixture.detectChanges();
    fixture.componentInstance.onBack();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-course-detail')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-search-bar')).toBeTruthy();
  });
});
