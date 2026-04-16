import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { Course, CourseService } from '../../services/course';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [NgClass],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css'
})
export class CourseDetailComponent {

  @Output() back = new EventEmitter<void>();

  // Prereq chain, unlock path, and full chain computed when course is set
  prereqChain: Course[] = [];
  unlockPath: Course[] = [];
  fullChain: Course[] = [];

  private _course: Course | null = null;

  @Input() set course(value: Course | null) {
    this._course = value;
    if (value) {
      this.prereqChain = this.courseService.getPrereqChain(value.courseId);
      this.unlockPath = this.courseService.getUnlockPath(value.courseId);
      this.fullChain = this.courseService.getFullChain(value.courseId);
    }
  }

  get course(): Course | null {
    return this._course;
  }

  constructor(private courseService: CourseService) {}
}
