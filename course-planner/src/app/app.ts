import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService, Course } from './services/course';
import { SearchBarComponent } from './components/search-bar/search-bar';
import { CourseCardComponent } from './components/course-card/course-card';
import { CourseDetailComponent } from './components/course-detail/course-detail';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    CourseCardComponent,
    CourseDetailComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  // Holds all courses loaded from CSV
  allCourses: Course[] = [];

  // Holds filtered results shown in the cards grid
  filteredCourses: Course[] = [];

  // Currently selected course for detail panel
  selectedCourse: Course | null = null;

  constructor(private courseService: CourseService) {}

  // Load courses when app starts
  ngOnInit() {
  this.courseService.loadCourses().subscribe(() => {
    // Store courses in topological order — prerequisites always before dependents
    this.allCourses = this.courseService.getTopologicalOrder();
    });
  }


  // Called on every keystroke from search bar
  onSearch(query: string) {
    if (query.trim() === '') {
      // Empty search — hide all cards
      this.filteredCourses = [];
      this.selectedCourse = null;
    } else {
      // Filter courses using Map-backed search
      // Filter then sort results in topological order
      this.filteredCourses = this.courseService.filterCourses(query)
      .sort((a, b) => {
        const order = this.allCourses.map(c => c.courseId);
        return order.indexOf(a.courseId) - order.indexOf(b.courseId);
  });

    }
  }

  // Called when a card is clicked
  // Hide cards grid and show detail panel when a card is selected
  onCourseSelected(course: Course) {
    this.selectedCourse = course;
    this.filteredCourses = [];
  }

}
