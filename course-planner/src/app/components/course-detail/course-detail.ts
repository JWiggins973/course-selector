import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { Course, CourseService } from '../../services/course';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="detail-container">

      <button class="back-btn" (click)="back.emit()">← Back to results</button>

      <!-- Course ID and title -->
      <div class="course-eyebrow">{{ course?.courseId }}</div>
      <h2 class="course-title">{{ course?.title }}</h2>
      <p class="course-description">{{ course?.description }}</p>

      <!-- Prereqs and unlocks side by side -->
      <div class="sections">

        <div class="section">
          <div class="section-label">Prerequisites</div>
          @if (prereqChain.length > 0) {
            @for (p of prereqChain; track p.courseId) {
              <div class="row">
                <span class="row-id">{{ p.courseId }}</span>
                <span class="row-title">{{ p.title }}</span>
              </div>
            }
          } @else {
            <p class="none">No prerequisites</p>
          }
        </div>

        <div class="section">
          <div class="section-label">Unlocks next</div>
          @if (unlockPath.length > 0) {
            @for (u of unlockPath; track u.courseId) {
              <div class="row">
                <span class="row-id">{{ u.courseId }}</span>
                <span class="row-title">{{ u.title }}</span>
              </div>
            }
          } @else {
            <p class="none">No courses unlocked</p>
          }
        </div>

      </div>

      <!-- Full course chain from zero to selected course -->
      <div class="chain-section">
        <div class="section-label">Complete path to this course</div>
        <div class="chain">
          @for (c of fullChain; track c.courseId) {
            @let isSelected = c.courseId === course?.courseId;
            <div class="chain-item">
              <div class="chain-left">
                <!-- Step number node -->
                <div class="chain-node" [ngClass]="isSelected ? 'target' : c.level">
                  {{ $index + 1 }}
                </div>
                <!-- Connecting line between nodes -->
                @if (!$last) {
                  <div class="chain-line"></div>
                }
              </div>
              <div class="chain-info">
                <div class="chain-id">{{ c.courseId }}</div>
                <div class="chain-course-title">
                  {{ c.title }}
                  @if (isSelected) {
                    <span class="selected-tag">selected</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    .detail-container {
      padding: 24px 28px;
    }

    .back-btn {
      background: none;
      border: none;
      color: var(--accent);
      cursor: pointer;
      font-size: 13px;
      padding: 0;
      margin-bottom: 20px;
      font-family: 'DM Sans', sans-serif;
    }

    .back-btn:hover { opacity: 0.8; }

    /* Course ID in monospace above title */
    .course-eyebrow {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      color: var(--accent);
      margin-bottom: 4px;
    }

    .course-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .course-description {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 24px;
    }

    /* Prereqs and unlocks side by side */
    .sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .section {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
    }

    /* Section heading label */
    .section-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--text-secondary);
      margin-bottom: 12px;
      font-family: 'Space Mono', monospace;
    }

    /* Each course row in prereqs and unlocks */
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 7px;
      background: var(--bg-card);
      margin-bottom: 6px;
    }

    .row-id {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: var(--accent);
      min-width: 68px;
      flex-shrink: 0;
    }

    .row-title { font-size: 12px; color: var(--text-secondary); }

    .none { font-size: 12px; color: var(--text-secondary); font-style: italic; }

    /* Full chain section */
    .chain-section {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px;
    }

    .chain { display: flex; flex-direction: column; }

    .chain-item { display: flex; align-items: flex-start; gap: 14px; }

    /* Left column holds node and connecting line */
    .chain-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 32px;
    }

    /* Step number circle */
    .chain-node {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      font-weight: 700;
    }

    /* Line connecting steps */
    .chain-line {
      width: 2px;
      height: 28px;
      background: var(--border);
    }

    /* Plain step numbers for path nodes — color is already shown on the card */
    .chain-node.green,
    .chain-node.yellow,
    .chain-node.red { color: var(--text-secondary); }

    /* Selected course node highlighted in blue */
    .chain-node.target { background: var(--color-target-bg); color: var(--color-target-text); box-shadow: 0 0 0 2px var(--color-target-ring); }

    .chain-info { padding: 6px 0 20px 0; }

    .chain-id {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: var(--accent);
      margin-bottom: 2px;
    }

    .chain-course-title { font-size: 13px; color: var(--text-secondary); }

    /* Tag shown next to selected course in chain */
    .selected-tag {
      font-size: 10px;
      color: var(--accent);
      margin-left: 6px;
      font-family: 'Space Mono', monospace;
    }
  `]
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
