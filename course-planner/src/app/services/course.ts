// Loads courses.csv and provides search, prereq chain, and unlock path lookups.
// Author: Jermaine Wiggins
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

  // Map replaces C++ vector + set; lookup is O(1) vs O(n) vector scan or O(log n) set lookup.
  private courseMap = new Map<string, Course>();

  // Reverse adjacency map: courseId -> ids of courses that require it.
  // Built once so getUnlockPath is O(1) lookup instead of O(n) scan.
  private reverseMap = new Map<string, string[]>();

  // Lazy cache: populated on first traversal, O(1) on repeat.
  private prereqCache = new Map<string, Course[]>();
  private fullChainCache = new Map<string, Course[]>();

  constructor(private http: HttpClient) {}

  // Parses courses.csv into the map and builds the reverse adjacency index.
  loadCourses() {
    return this.http.get('courses.csv', { responseType: 'text' }).pipe(
      map(csv => {
        this.courseMap.clear();
        this.reverseMap.clear();
        this.prereqCache.clear();
        this.fullChainCache.clear();
        csv.trim().split('\n').slice(1).forEach(line => {
          const course = this._parseLine(line);
          if (!course) return;
          this.courseMap.set(course.courseId, course);
          // Index this course under each of its prereqs for reverse lookup
          course.prereqs.forEach(prereq => {
            const existing = this.reverseMap.get(prereq) ?? [];
            existing.push(course.courseId);
            this.reverseMap.set(prereq, existing);
          });
        });
        return Array.from(this.courseMap.values());
      })
    );
  }

  // Parses one CSV line into a Course. Returns null for malformed lines.
  private _parseLine(line: string): Course | null {
    const parts = line.split(',');
    if (parts.length < 3) return null;
    const courseId = parts[0].trim();
    const title = parts[1].trim();
    const prereqs = parts[2]
      ? parts[2].replace(/"/g, '').split('|').filter(p => p.trim())
      : [];
    const description = parts.slice(3).join(',').trim(); // rejoin so commas inside descriptions are preserved
    const level = prereqs.length === 0 ? 'green'
                : prereqs.length === 1 ? 'yellow'
                : 'red';
    return { courseId, title, description, prereqs, level };
  }

  // O(1) map lookup vs O(n) vector scan in original C++.
  getCourse(courseId: string): Course | undefined {
    return this.courseMap.get(courseId);
  }

  // Returns all prereqs in order, most basic first. Cached after the first call.
  // getFullChain already builds the right order — this just drops the selected course at the end.
  getPrereqChain(courseId: string): Course[] {
    if (this.prereqCache.has(courseId)) return this.prereqCache.get(courseId)!;
    const chain = this.getFullChain(courseId).slice(0, -1);
    this.prereqCache.set(courseId, chain);
    return chain;
  }

  // Returns courses that list this course as a direct prereq.
  getUnlockPath(courseId: string): Course[] {
    return (this.reverseMap.get(courseId) ?? [])
      .map(depId => this.courseMap.get(depId))
      .filter((c): c is Course => c !== undefined);
  }

  // Full step-by-step path to this course, starting from courses with no prereqs.
  // Cached after the first call.
  getFullChain(courseId: string): Course[] {
    if (this.fullChainCache.has(courseId)) return this.fullChainCache.get(courseId)!;

    const visited = new Set<string>();
    const chain: Course[] = [];

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const course = this.courseMap.get(id);
      if (!course) return;
      // Visit prereqs first so they appear before the courses that need them
      for (const prereq of course.prereqs) {
        traverse(prereq);
      }
      chain.push(course);
    };

    traverse(courseId);
    this.fullChainCache.set(courseId, chain);
    return chain;
  }

  // Searches all courses by ID, title, or description.
  filterCourses(query: string): Course[] {
    const q = query.toLowerCase();
    return Array.from(this.courseMap.values()).filter(c =>
      c.courseId.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  // Returns all courses sorted so prereqs always come before the courses that need them.
  // Replaces the original C++ alphabetical sort; runs once at startup instead of on every print.
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
