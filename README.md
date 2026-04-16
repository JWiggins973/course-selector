# ABCU Course Planner

Original C++ course planner rebuilt as an Angular web app with better data structures and algorithms.

## 🚀 Live Demo

[https://jwiggins973.github.io/course-selector/](https://jwiggins973.github.io/course-selector/)

## 📄 Original Artifact

[View original C++ source on main](https://github.com/JWiggins973/course-selector/tree/main)

## ⚡ Enhancements

**Data Structure** — Replaced `vector` linear scans with a `Map` for O(1) lookups. A reverse adjacency map is built at load so unlock path queries are also O(1).

**Sorting** — Replaced alphabetical quicksort with topological sort so prerequisites always come before the courses that need them.

**Prerequisite Chain** — The original showed one level deep. The rewrite walks the full graph and returns all ancestors in order, cached after the first call.

**Unlock Path** — Not in the original. Each course is indexed under its prerequisites at load time, so finding what a course unlocks is a single map lookup.

**UI** — Real-time search by ID, title, or description. Cards color-coded by prerequisite count. Click a card to see the full prerequisite chain, unlock path, and step-by-step course path.

## 🛠️ Run Locally

```bash
cd course-planner
npm install
ng serve
```

## 🧪 Tests

```bash
ng test
```
