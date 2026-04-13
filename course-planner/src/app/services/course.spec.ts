import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CourseService } from './course';

// Minimal CSV fixture — enough to test chains and filters
// MATH100 -> MATH200 -> MATH300 (linear chain)
// CSCI100 has no prereqs; CSCI200 requires MATH100|CSCI100; CSCI300 requires CSCI200
const FIXTURE_CSV = `courseId,title,prereqs,description
MATH100,Calculus I,,Intro to calculus
MATH200,Calculus II,MATH100,Continuation of calculus
MATH300,Calculus III,MATH200,Multivariable calculus
CSCI100,Intro to CS,,Programming fundamentals
CSCI200,Data Structures,MATH100|CSCI100,Arrays trees and graphs
CSCI300,Algorithms,CSCI200,Algorithm design and analysis`;

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // Seeds the service by flushing the CSV fixture into the HTTP mock
  function seedCourses() {
    service.loadCourses().subscribe();
    httpMock.expectOne('courses.csv').flush(FIXTURE_CSV);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCourse returns correct course by ID', () => {
    seedCourses();
    const course = service.getCourse('MATH100');
    expect(course?.title).toBe('Calculus I');
    expect(course?.level).toBe('green');
  });

  it('getCourse returns undefined for unknown ID', () => {
    seedCourses();
    expect(service.getCourse('FAKE999')).toBeUndefined();
  });

  it('level is green for 0 prereqs, yellow for 1, red for 2+', () => {
    seedCourses();
    expect(service.getCourse('CSCI100')?.level).toBe('green');
    expect(service.getCourse('MATH200')?.level).toBe('yellow');
    expect(service.getCourse('CSCI200')?.level).toBe('red');
  });

  it('getPrereqChain returns all ancestors in order', () => {
    seedCourses();
    const chain = service.getPrereqChain('MATH300');
    const ids = chain.map(c => c.courseId);
    // MATH200 and MATH100 must both appear, MATH100 before MATH200
    expect(ids).toContain('MATH100');
    expect(ids).toContain('MATH200');
    expect(ids.indexOf('MATH100')).toBeLessThan(ids.indexOf('MATH200'));
  });

  it('getPrereqChain returns empty for a course with no prereqs', () => {
    seedCourses();
    expect(service.getPrereqChain('CSCI100')).toEqual([]);
  });

  it('getUnlockPath returns only direct dependents, not the full tree', () => {
    seedCourses();
    // MATH100 is a direct prereq of MATH200 and CSCI200 — those two only
    const unlocks = service.getUnlockPath('MATH100').map(c => c.courseId);
    expect(unlocks).toContain('MATH200');
    expect(unlocks).toContain('CSCI200');
    // MATH300 requires MATH200, not MATH100 directly — must NOT appear
    expect(unlocks).not.toContain('MATH300');
    // CSCI300 requires CSCI200, not MATH100 directly — must NOT appear
    expect(unlocks).not.toContain('CSCI300');
  });

  it('getUnlockPath returns empty for a terminal course', () => {
    seedCourses();
    expect(service.getUnlockPath('CSCI300')).toEqual([]);
  });

  it('getFullChain returns topologically sorted path ending at selected course', () => {
    seedCourses();
    const chain = service.getFullChain('MATH300').map(c => c.courseId);
    expect(chain).toEqual(['MATH100', 'MATH200', 'MATH300']);
  });

  it('getFullChain for a course with no prereqs returns just that course', () => {
    seedCourses();
    const chain = service.getFullChain('CSCI100').map(c => c.courseId);
    expect(chain).toEqual(['CSCI100']);
  });

  it('filterCourses matches on courseId', () => {
    seedCourses();
    const results = service.filterCourses('MATH');
    expect(results.length).toBe(3);
  });

  it('filterCourses matches on title (case-insensitive)', () => {
    seedCourses();
    const results = service.filterCourses('calculus');
    expect(results.length).toBe(3);
  });

  it('filterCourses matches on description', () => {
    seedCourses();
    const results = service.filterCourses('graphs');
    expect(results.length).toBe(1);
    expect(results[0].courseId).toBe('CSCI200');
  });

  it('filterCourses returns empty for no match', () => {
    seedCourses();
    expect(service.filterCourses('zzznomatch')).toEqual([]);
  });

  it('getTopologicalOrder places prereqs before dependents', () => {
    seedCourses();
    const order = service.getTopologicalOrder().map(c => c.courseId);
    expect(order.indexOf('MATH100')).toBeLessThan(order.indexOf('MATH200'));
    expect(order.indexOf('MATH200')).toBeLessThan(order.indexOf('MATH300'));
    expect(order.indexOf('CSCI100')).toBeLessThan(order.indexOf('CSCI200'));
    expect(order.indexOf('CSCI200')).toBeLessThan(order.indexOf('CSCI300'));
  });
});
