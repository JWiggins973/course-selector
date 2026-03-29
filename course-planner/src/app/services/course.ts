import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Course struct added color level for UI — not stored in CSV
export interface Course {
  courseId: string;
  title: string;
  prereqs: string[];
  level: 'green' | 'yellow' | 'red'; // 0 prereqs = green, 1 = yellow, 2+ = red
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  // Map replaces C++ vector + set
  // vector search was O(n), set lookup was O(log n)
  // Map lookup is O(1) — faster at any scale
  private courseMap = new Map<string, Course>();

  // Lazy cache — stores results after first computation
  // Only caches courses the user actually clicks for memory efficiency
  // First click: O(n + e), repeat click: O(1)
  private prereqCache = new Map<string, Course[]>();
  private unlockCache = new Map<string, Course[]>();

  constructor(private http: HttpClient) {}

  // Reads CSV and stores each course in the Map
  // Runs once — O(n) to build, O(1) to access after
  loadCourses() {
    return this.http.get('courses.csv', { responseType: 'text' }).pipe(
      map(csv => {
        this.courseMap.clear();
        this.prereqCache.clear(); // clear cache on reload
        this.unlockCache.clear(); // clear cache on reload
        const lines = csv.trim().split('\n').slice(1); // skip header
        lines.forEach(line => {
          const [courseId, title, prereqStr] = line.split(',');
          const prereqs = prereqStr
            ? prereqStr.replace(/"/g, '').split('|').filter(p => p.trim())
            : [];
          // Level computed from prereq count — not stored in CSV
          const level = prereqs.length === 0 ? 'green'
                      : prereqs.length === 1  ? 'yellow'
                      : 'red';
          const course: Course = { courseId: courseId.trim(), title: title.trim(), prereqs, level };
          this.courseMap.set(courseId.trim(), course);
        });
        return Array.from(this.courseMap.values());
      })
    );
  }

  // O(1) lookup by course ID
  // Original C++ scanned the entire vector — O(n)
  getCourse(courseId: string): Course | undefined {
    return this.courseMap.get(courseId);
  }

  // Walks up the prereq chain recursively
  // First click: O(n + e) — computes and caches result
  // Repeat click: O(1) — reads from cache
  getPrereqChain(courseId: string): Course[] {
    // Return cached result if available — O(1)
    if (this.prereqCache.has(courseId)) return this.prereqCache.get(courseId)!;

    // First time — compute recursively
    const visited = new Set<string>();
    const traverse = (id: string): Course[] => {
      if (visited.has(id)) return [];
      visited.add(id);
      const course = this.courseMap.get(id);
      if (!course) return [];
      const chain: Course[] = [];
      for (const prereq of course.prereqs) {
        const prereqCourse = this.courseMap.get(prereq);
        if (prereqCourse) {
          chain.push(prereqCourse);
          chain.push(...traverse(prereq)); // recurse
        }
      }
      return chain;
    };

    const result = traverse(courseId);
    this.prereqCache.set(courseId, result); // cache for next time
    return result;
  }

  // Walks forward recursively to find what this course unlocks
  // First click: O(n + e) — computes and caches result
  // Repeat click: O(1) — reads from cache
  // New algorithm — did not exist in original C++
  getUnlockPath(courseId: string): Course[] {
    // Return cached result if available — O(1)
    if (this.unlockCache.has(courseId)) return this.unlockCache.get(courseId)!;

    // First time — compute recursively
    const visited = new Set<string>();
    const traverse = (id: string): Course[] => {
      if (visited.has(id)) return [];
      visited.add(id);
      const unlocked: Course[] = [];
      this.courseMap.forEach(course => {
        if (course.prereqs.includes(id)) {
          unlocked.push(course);
          unlocked.push(...traverse(course.courseId)); // recurse
        }
      });
      return unlocked;
    };

    const result = traverse(courseId);
    this.unlockCache.set(courseId, result); // cache for next time
    return result;
  }

  // Filters courses by ID or title — O(n) scan
  filterCourses(query: string): Course[] {
    const q = query.toLowerCase();
    return Array.from(this.courseMap.values()).filter(c =>
      c.courseId.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q)
    );
  }

  // Sorts courses by dependency order — prereqs always before dependents
  // Replaces original C++ quicksort which sorted alphabetically (no real world value more of a algorithm exercise)
  // Original: O(n log n), ran every time user selected print
  // Enhanced: O(n + e), runs once at startup
  getTopologicalOrder(): Course[] {
    const visited = new Set<string>();
    const result: Course[] = [];
    const visit = (courseId: string) => {
      if (visited.has(courseId)) return;
      visited.add(courseId);
      const course = this.courseMap.get(courseId);
      if (!course) return;
      for (const prereq of course.prereqs) {
        visit(prereq); // visit prereqs first
      }
      result.push(course); // add after prereqs
    };
    this.courseMap.forEach(course => visit(course.courseId));
    return result;
  }
}
