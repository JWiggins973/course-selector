import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../services/course';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [ngClass]="course.level" (click)="onSelect()">
      <!-- Course ID  -->
      <h3 class="course-id">{{ course.courseId }}</h3>
      <!-- Course title -->
      <p class="course-title">{{ course.title }}</p>
      <!-- Badge showing prereq count -->
      <span class="badge">
        {{ course.prereqs.length === 0 ? 'No prereqs' : course.prereqs.length + ' prereq(s)' }}
      </span>
    </div>
  `,
  styles: [`
    /* Base card styles */
    .card {
      padding: 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
    }

    /* Lift card on hover */
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }

    /* Green - entry level, no prereqs */
    .green {
      background-color: #d4edda;
      border-color: #28a745;
    }

    /* Yellow - intermediate, 1 prereq */
    .yellow {
      background-color: #fff3cd;
      border-color: #ffc107;
    }

    /* Red - advanced, 2+ prereqs */
    .red {
      background-color: #f8d7da;
      border-color: #dc3545;
    }

    .course-id {
      margin: 0 0 6px 0;
      font-size: 18px;
      font-weight: bold;
    }

    .course-title {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #333;
    }

    /* Small pill style badge showing prereq count */
    .badge {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      background: rgba(0,0,0,0.1);
    }
  `]
})
export class CourseCardComponent {

  // Course data passed in from parent
  @Input() course!: Course;

  // Notifies parent when this card is clicked
  @Output() selected = new EventEmitter<Course>();

  // Emit the course object up to the parent
  onSelect() {
    this.selected.emit(this.course);
  }
}

