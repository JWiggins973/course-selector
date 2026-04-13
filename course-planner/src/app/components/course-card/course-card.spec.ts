import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseCardComponent } from './course-card';
import { Course } from '../../services/course';

const MOCK_COURSE: Course = {
  courseId: 'CSCI100',
  title: 'Intro to CS',
  description: 'Programming fundamentals',
  prereqs: [],
  level: 'green'
};

describe('CourseCard', () => {
  let component: CourseCardComponent;
  let fixture: ComponentFixture<CourseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCardComponent);
    component = fixture.componentInstance;
    component.course = MOCK_COURSE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display course ID and title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.course-id')?.textContent).toContain('CSCI100');
    expect(el.querySelector('.course-title')?.textContent).toContain('Intro to CS');
  });

  it('should show "No prereqs" badge for a course with no prerequisites', () => {
    const badge = fixture.nativeElement.querySelector('.badge') as HTMLElement;
    expect(badge.textContent).toContain('No prereqs');
  });

  it('should show prereq count for a course with prerequisites', () => {
    component.course = { ...MOCK_COURSE, prereqs: ['MATH100', 'CSCI090'], level: 'red' };
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.badge') as HTMLElement;
    expect(badge.textContent).toContain('2 prereq(s)');
  });

  it('should emit selected event when clicked', () => {
    const emitted: Course[] = [];
    component.selected.subscribe((c: Course) => emitted.push(c));
    (fixture.nativeElement.querySelector('.card') as HTMLElement).click();
    expect(emitted.length).toBe(1);
    expect(emitted[0].courseId).toBe('CSCI100');
  });
});
