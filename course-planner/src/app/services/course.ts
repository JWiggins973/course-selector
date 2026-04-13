import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Course struct — level is computed from prereq count, not stored in CSV
export interface Course {
  courseId: string;
  title: string;
  description: string;
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

  // Reverse adjacency map — courseId -> courses that require it
  // Built once at load time so getUnlockPath traversal is O(n + e) instead of O(n²)
  private reverseMap = new Map<string, string[]>();

  // Lazy cache — stores results after first computation
  // Only caches courses the user actually clicks for memory efficiency
  // First click: O(n + e), repeat click: O(1)
  private prereqCache = new Map<string, Course[]>();
  private fullChainCache = new Map<string, Course[]>();

  constructor(private http: HttpClient) {}

  // Reads CSV and stores each course in the Map
  // Runs once — O(n) to build, O(1) to access after
  loadCourses() {
    return this.http.get('courses.csv', { responseType: 'text' }).pipe(
      map(csv => {
        this.courseMap.clear();
        this.reverseMap.clear();
        this.prereqCache.clear();
        this.fullChainCache.clear();
        const lines = csv.trim().split('\n').slice(1); // skip header
        lines.forEach(line => {
          const parts = line.split(',');
          if (parts.length < 3) return; // skip malformed lines
          const courseId = parts[0].trim();
          const title = parts[1].trim();
          const prereqStr = parts[2];
          const description = parts.slice(3).join(',').trim(); // rejoin tail so commas in descriptions are preserved
          const prereqs = prereqStr
            ? prereqStr.replace(/"/g, '').split('|').filter(p => p.trim())
            : [];
          // Level computed from prereq count — not stored in CSV
          const level = prereqs.length === 0 ? 'green'
                      : prereqs.length === 1  ? 'yellow'
                      : 'red';
          const course: Course = { courseId, title, description, prereqs, level };
          this.courseMap.set(courseId, course);

          // Add this course to each prereq's reverse map entry
          prereqs.forEach(prereq => {
            const existing = this.reverseMap.get(prereq) ?? [];
            existing.push(courseId);
            this.reverseMap.set(prereq, existing);
          });
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
    if (this.prereqCache.has(courseId)) return this.prereqCache.get(courseId)!;

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
          chain.push(...traverse(prereq));
        }
      }
      return chain;
    };

    const result = traverse(courseId);
    this.prereqCache.set(courseId, result);
    return result;
  }

  // Returns courses that directly list this course as a prereq
  // Uses reverse adjacency map for O(1) lookup — no recursion needed
  getUnlockPath(courseId: string): Course[] {
    return (this.reverseMap.get(courseId) ?? [])
      .map(depId => this.courseMap.get(depId))
      .filter((c): c is Course => c !== undefined);
  }

  // Builds the full ordered path from zero to the selected course
  // Walks prereqs recursively then adds the course itself — topological order
  // First click: O(n + e) — computes and caches result
  // Repeat click: O(1) — reads from cache
  getFullChain(courseId: string): Course[] {
    if (this.fullChainCache.has(courseId)) return this.fullChainCache.get(courseId)!;

    const visited = new Set<string>();
    const chain: Course[] = [];

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const course = this.courseMap.get(id);
      if (!course) return;
      // Visit prereqs first so they appear before dependents
      for (const prereq of course.prereqs) {
        traverse(prereq);
      }
      chain.push(course);
    };

    traverse(courseId);
    this.fullChainCache.set(courseId, chain);
    return chain;
  }

  // Filters courses by ID, title, or description — O(n) scan
  filterCourses(query: string): Course[] {
    const q = query.toLowerCase();
    return Array.from(this.courseMap.values()).filter(c =>
      c.courseId.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  // Sorts courses by dependency order — prereqs always before dependents
  // Replaces original C++ quicksort which sorted alphabetically
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
        visit(prereq);
      }
      result.push(course);
    };
    this.courseMap.forEach(course => visit(course.courseId));
    return result;
  }
}
