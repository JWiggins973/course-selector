import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CourseService } from '../../services/course';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container" *ngIf="course">

      <!-- Course title and ID -->
      <h2>{{ course.courseId }}: {{ course.title }}</h2>

      <!-- Prerequisite list -->
      <div class="section">
        <h3>Before taking this course you need:</h3>
        <ul *ngIf="prereqChain.length > 0; else noPrereqs">
          <li *ngFor="let p of prereqChain">
            {{ p.courseId }} - {{ p.title }}
          </li>
        </ul>
        <ng-template #noPrereqs>
          <p>No prerequisites — this is an entry level course.</p>
        </ng-template>
      </div>

      <!-- Progress path -->
      <div class="section">
        <h3>Taking this course unlocks:</h3>
        <ul *ngIf="unlockPath.length > 0; else noUnlocks">
          <li *ngFor="let u of unlockPath">
            {{ u.courseId }} - {{ u.title }}
          </li>
        </ul>
        <ng-template #noUnlocks>
          <p>This course has no further unlock path.</p>
        </ng-template>
      </div>

    </div>
  `,
  styles: [`
    /* Wrapper for the entire detail panel */
    .detail-container {
      margin-top: 30px;
      padding: 24px;
      border-radius: 10px;
      background: #f8f9fa;
      border: 1px solid #ddd;
    }

    h2 {
      margin: 0 0 20px 0;
      font-size: 22px;
    }

    /* Each section prereqs and unlock path */
    .section {
      margin-bottom: 20px;
    }

    h3 {
      font-size: 16px;
      margin-bottom: 8px;
      color: #555;
    }

    ul {
      padding-left: 20px;
    }

    li {
      margin-bottom: 6px;
      font-size: 15px;
    }
  `]
})
export class CourseDetailComponent {

  // Selected course passed in from parent
  @Input() set course(value: Course | null) {
    this._course = value;
    if (value) {
      // Build prereq chain and unlock path when course changes
      this.prereqChain = this.courseService.getPrereqChain(value.courseId);
      this.unlockPath = this.courseService.getUnlockPath(value.courseId);
    }
  }

  get course(): Course | null {
    return this._course;
  }

  private _course: Course | null = null;

  // Stores recursive prereq chain results
  prereqChain: Course[] = [];

  // Stores recursive unlock path results
  unlockPath: Course[] = [];

  constructor(private courseService: CourseService) {}
}
