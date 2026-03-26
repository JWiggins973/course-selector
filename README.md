# Course Planner — Enhancements

## C++ Enhancement
### Changes from Original
- Replaced `std::vector` + `std::set` with `unordered_map` for O(1) lookups
- Added recursive prerequisite chain function

### Build & Run
g++ -std=c++17 main.cpp dataStructureFunctions.cpp -o course-selector
./course-selector

## Angular Application
### Features
- Searchable course cards grid
- Color coded by prerequisite count (green = none, yellow = 1, red = 2+)
- Prerequisite chain detail panel
- Progress path visualization — shows what courses this unlocks

### Run Locally
cd course-planner
ng serve

### Live Demo
[GitHub Pages link coming Soon]
