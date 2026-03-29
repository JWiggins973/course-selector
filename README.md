# ABCU Course Planner — Enhanced

Original C++ course planner rebuilt as an Angular web app with improved 
data structures and algorithms.

## Improvements Over Original C++

**Data Structure**
- Replaced `vector` + `set` with `Map` — O(1) lookups vs O(n) and O(log n)

**Algorithms**
- Topological sort replaces alphabetical quicksort — orders by dependency
- Recursive prerequisite chain — shows everything needed before a course
- Recursive unlock path — shows what a course opens up
- Memoization cache — repeat lookups are O(1)

## App Features
- Search courses in real time
- Cards color coded by difficulty
  - 🟢 No prerequisites
  - 🟡 1 prerequisite
  - 🔴 2+ prerequisites
- Click a card to see prerequisite chain and unlock path

## Run Locally
```bash
cd course-planner
ng serve

### Live Demo
[GitHub Pages link coming Soon]
