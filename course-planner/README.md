# ABCU Course Planner — Enhanced

Original C++ course planner rebuilt as an Angular web app with improved data structures and algorithms.

## Live Demo

[https://jwiggins973.github.io/course-selector/](https://jwiggins973.github.io/course-selector/)

## Improvements Over Original C++

**Data Structure**
- Replaced `vector` + `set` with `Map` — O(1) lookups vs O(n) and O(log n)

**Algorithms**
- Topological sort replaces alphabetical quicksort — orders by dependency
- Recursive prerequisite chain — shows everything needed before a course
- Direct unlock path via reverse adjacency map — shows what a course opens up
- Lazy memoization cache — repeat lookups are O(1)

## App Features

- Search courses in real time by ID, title, or description
- Cards color-coded by prerequisite count
  - Green — no prerequisites
  - Yellow — 1 prerequisite
  - Red — 2+ prerequisites
- Click a card to see prerequisite chain, unlock path, and complete course path
- Dark mode by default, adapts to OS preference

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── course-card/       # Card shown in search results
│   │   ├── course-detail/     # Full detail view for a selected course
│   │   └── search-bar/        # Debounced search input
│   ├── services/
│   │   └── course.ts          # Data loading, filtering, and graph traversal
│   ├── app.ts                 # Root component
│   └── app.html               # Root template
├── styles.css                 # Global CSS tokens and theming
public/
└── courses.csv                # Course data (34 courses)
```

## Run Locally

```bash
cd course-planner
npm install
ng serve
```

## Tests

Unit tests added across all components and services to support scalability as the course catalog grows.

```bash
ng test
```
