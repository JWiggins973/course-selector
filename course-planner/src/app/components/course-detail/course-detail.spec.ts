import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseDetailComponent } from './course-detail';
import { CourseService, Course } from '../../services/course';

const MATH100: Course = { courseId: 'MATH100', title: 'Calculus I', description: 'Intro to calculus', prereqs: [], level: 'green' };
const MATH200: Course = { courseId: 'MATH200', title: 'Calculus II', description: 'Continuation', prereqs: ['MATH100'], level: 'yellow' };

const mockService: Partial<CourseService> = {
  getPrereqChain: () => [MATH100],
  getUnlockPath: () => [],
  getFullChain: () => [MATH100, MATH200]
};

describe('CourseDetail', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailComponent],
      providers: [{ provide: CourseService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
    component.course = MATH200;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows course ID and title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.course-eyebrow')?.textContent).toContain('MATH200');
    expect(el.querySelector('.course-title')?.textContent).toContain('Calculus II');
  });

  it('back button emits the back event', () => {
    const emitted: void[] = [];
    component.back.subscribe(() => emitted.push(undefined));
    (fixture.nativeElement.querySelector('.back-btn') as HTMLButtonElement).click();
    expect(emitted.length).toBe(1);
  });

  it('shows prereq rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('.section:first-child .row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('MATH100');
  });

  it('shows all steps in the full chain', () => {
    const items = fixture.nativeElement.querySelectorAll('.chain-item');
    expect(items.length).toBe(2);
  });
});
