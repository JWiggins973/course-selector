import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app';

const TEST_CSV = `courseId,title,prereqs,description
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

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    httpMock.expectOne('courses.csv').flush(TEST_CSV);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show course cards after a search', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    httpMock.expectOne('courses.csv').flush(TEST_CSV);
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.componentInstance.onSearch('CSCI');
    fixture.componentRef.changeDetectorRef.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-course-card').length).toBe(2);
  });

  it('should show detail view when a course is selected', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    httpMock.expectOne('courses.csv').flush(TEST_CSV);
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.componentInstance.onCourseSelected(fixture.componentInstance.allCourses[0]);
    fixture.componentRef.changeDetectorRef.detectChanges();
    expect(fixture.nativeElement.querySelector('app-course-detail')).toBeTruthy();
  });

  it('should return to search view when back is triggered', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    httpMock.expectOne('courses.csv').flush(TEST_CSV);
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.componentInstance.onCourseSelected(fixture.componentInstance.allCourses[0]);
    fixture.componentRef.changeDetectorRef.detectChanges();
    fixture.componentInstance.onBack();
    fixture.componentRef.changeDetectorRef.detectChanges();
    expect(fixture.nativeElement.querySelector('app-course-detail')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-search-bar')).toBeTruthy();
  });
});
