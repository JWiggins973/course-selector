# ABCU Course Planner

A command-line course planning tool that loads course data from a CSV file
and allows users to search and sort courses in the ABCU Computer Science program.

## Original C++ Implementation

### Data Structures Used
- `std::vector` — stores all course objects
- `std::set` — validates prerequisite course codes
- Custom quicksort — sorts courses alphabetically by course code at print time

### Algorithm Complexity
- Loading: O(n)
- Sorting: O(n log n) — quicksort
- Search: O(n) — linear scan through vector
- Prerequisite validation: O(log n) — set lookup

### Features
- Load courses from CSV file
- Sort and print all courses alphabetically
- Search for a specific course by course code
- Prerequisite validation on load

### Build & Run
```bash
g++ -std=c++17 main.cpp dataStructureFunctions.cpp -o course-selector
./course-selector

