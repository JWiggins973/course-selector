import { Component, OnInit } from '@angular/core';
import { CourseService, Course } from './services/course';
import { SearchBarComponent } from './components/search-bar/search-bar';
import { CourseCardComponent } from './components/course-card/course-card';
import { CourseDetailComponent } from './components/course-detail/course-detail';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SearchBarComponent,
    CourseCardComponent,
    CourseDetailComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;
  searchQuery = '';

  // Built once after load — O(n) — used to sort filtered results in topological order
  private orderMap = new Map<string, number>();

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.loadCourses().subscribe({
      next: () => {
        this.allCourses = this.courseService.getTopologicalOrder();
        this.allCourses.forEach((c, i) => this.orderMap.set(c.courseId, i));
      },
      error: (err) => console.error('Failed to load courses:', err)
    });
  }

  // Called on every debounced keystroke from search bar
  onSearch(query: string) {
    this.searchQuery = query.trim();
    if (this.searchQuery === '') {
      this.filteredCourses = [];
      this.selectedCourse = null;
    } else {
      this.filteredCourses = this.courseService
        .filterCourses(this.searchQuery)
        .sort((a, b) => (this.orderMap.get(a.courseId) ?? 0) - (this.orderMap.get(b.courseId) ?? 0));
    }
  }

  onCourseSelected(course: Course) {
    this.selectedCourse = course;
    window.scrollTo(0, 0);
  }

  onBack() {
    this.selectedCourse = null;
  }
}
