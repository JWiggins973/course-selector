import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { Course } from '../../services/course';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="card" [ngClass]="course.level" (click)="onSelect()">
      <div class="card-top-bar"></div>
      <h3 class="course-id">{{ course.courseId }}</h3>
      <p class="course-title">{{ course.title }}</p>
      <span class="badge">{{ prereqLabel }}</span>
    </div>
  `,
  styles: [`
    .card {
      padding: 16px;
      border-radius: 10px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: transform 0.15s, box-shadow 0.15s;
      background: var(--bg-surface);
      position: relative;
      overflow: hidden;
    }

    /* Colored strip along the top of each card */
    .card-top-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    /* Green — no prereqs */
    .green { border-color: var(--color-green-border); background: color-mix(in srgb, var(--color-green-tint) 10%, var(--bg-surface)); }
    .green .card-top-bar { background: var(--color-green-text); }
    .green .badge { background: var(--color-green-bg); color: var(--color-green-text); }

    /* Yellow — 1 prereq */
    .yellow { border-color: var(--color-yellow-border); background: color-mix(in srgb, var(--color-yellow-tint) 10%, var(--bg-surface)); }
    .yellow .card-top-bar { background: var(--color-yellow-text); }
    .yellow .badge { background: var(--color-yellow-bg); color: var(--color-yellow-text); }

    /* Red — 2+ prereqs */
    .red { border-color: var(--color-red-border); background: color-mix(in srgb, var(--color-red-tint) 10%, var(--bg-surface)); }
    .red .card-top-bar { background: var(--color-red-text); }
    .red .badge { background: var(--color-red-bg); color: var(--color-red-text); }

    /* Monospace for course ID */
    .course-id {
      margin: 8px 0 6px 0;
      font-size: 16px;
      font-weight: 700;
      font-family: 'Space Mono', monospace;
      color: var(--text-primary);
    }

    .course-title {
      margin: 0 0 12px 0;
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    /* Prereq count pill */
    .badge {
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 6px;
      font-family: 'Space Mono', monospace;
    }
  `]
})
export class CourseCardComponent {

  @Input({ required: true }) course!: Course;

  @Output() selected = new EventEmitter<Course>();

  get prereqLabel(): string {
    return this.course.prereqs.length === 0
      ? 'No prereqs'
      : `${this.course.prereqs.length} prereq(s)`;
  }

  onSelect() {
    this.selected.emit(this.course);
  }
}
