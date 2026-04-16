import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CourseService } from './course';

const TEST_CSV = `courseId,title,prereqs,description
MATH100,Calculus I,,Intro to calculus
MATH200,Calculus II,MATH100,Continuation of calculus
CSCI100,Intro to CS,,Programming fundamentals
CSCI200,Data Structures,MATH100|CSCI100,Arrays trees and graphs`;

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
    service.loadCourses().subscribe();
    httpMock.expectOne('courses.csv').flush(TEST_CSV);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCourse returns the correct course', () => {
    const course = service.getCourse('MATH100');
    expect(course?.title).toBe('Calculus I');
    expect(course?.level).toBe('green');
  });

  it('level is green for 0 prereqs, yellow for 1, red for 2+', () => {
    expect(service.getCourse('CSCI100')?.level).toBe('green');
    expect(service.getCourse('MATH200')?.level).toBe('yellow');
    expect(service.getCourse('CSCI200')?.level).toBe('red');
  });

  it('getPrereqChain returns ancestors in order', () => {
    const ids = service.getPrereqChain('MATH200').map(c => c.courseId);
    expect(ids).toEqual(['MATH100']);
  });

  it('getUnlockPath returns direct dependents only', () => {
    const ids = service.getUnlockPath('MATH100').map(c => c.courseId);
    expect(ids).toContain('MATH200');
    expect(ids).toContain('CSCI200');
  });

  it('filterCourses matches on ID and title', () => {
    expect(service.filterCourses('MATH').length).toBe(2);
    expect(service.filterCourses('calculus').length).toBe(2);
  });

  it('getTopologicalOrder places prereqs before dependents', () => {
    const order = service.getTopologicalOrder().map(c => c.courseId);
    expect(order.indexOf('MATH100')).toBeLessThan(order.indexOf('MATH200'));
    expect(order.indexOf('MATH100')).toBeLessThan(order.indexOf('CSCI200'));
  });
});
