// FIXME: Add purpose description to file header - clarify program name, author, date, and purpose
// Project 2 function definitions
// Project 2
// Created by Jermaine Wiggins on 2/21/25.

#include <iostream>
#include <cctype>
#include <vector>
#include <fstream>
#include <string>
#include <sstream>
#include <set>
#include <stdexcept>
#include "dataStructureFunctions.h"

using namespace std;

// Opens file and exits program if file cannot be opened
void openFile(fstream& inFile, const string& FILENAME) {
    inFile.open(FILENAME);
    if (!inFile.is_open()) {
        cerr << "Error opening " << FILENAME << endl;
        inFile.close();
        exit(1);
    }
}

// Loads all course codes from csv into a set used to validate prerequisites
void loadSet(fstream& inFile, const string& FILENAME, set<string>& allCourses) {
    openFile(inFile, FILENAME); // FIXME: File opened here and again in checkReadFile - redundant double open
    string line;
    string code;
    stringstream courseInfo(line); // FIXME: Redundant - courseInfo declared again inside loop below, this line does nothing
    // Copy each course code from csv into the set
    while (getline(inFile, line)) {
        stringstream courseInfo(line);
        getline(courseInfo, code, ',');
        if (!code.empty())
            allCourses.insert(code);
    }
    cout << FILENAME << " loaded into set" << endl;
    inFile.close();
}

// Checks if course code and name are present - returns false if either is missing
bool validateCourse(const Course& newCourse) {
    // FIXME: Logic error - && should be || to correctly catch all invalid courses
    // Current condition only catches case where BOTH fields fail simultaneously
    if ((newCourse.courseCode.empty() && !isspace(newCourse.courseCode[0])) || (newCourse.courseName.empty())) {
        cout << "Not a valid file, name or code missing" << endl;
        return false;
    }
    return true;
}

// Checks if each prerequisite exists as a valid course code in the set
bool validatePrereq(const set<string>& allCourses, Course& newCourse) {
    if (newCourse.preReq.size() > 0) {
        for (const auto& prereq : newCourse.preReq) {
            if (allCourses.find(prereq) == allCourses.end()) {
                cout << "Prerequisite " << prereq << " not found in course codes." << endl;
                return false;
            }
        }
    }
    return true;
} // FIXME: BUG - copyToVector is defined inside this closing brace in original - misplaced, causes compile error

// Copies a course object into the courses vector
void copyToVector(vector<Course>& courses, Course& newCourse) {
    courses.push_back(newCourse);
}

// Loads set, validates, and copies all courses from csv into the vector data structure
void checkReadFile(fstream& inFile, const string& FILENAME, set<string>& allCourses, vector<Course>& courses) {
    loadSet(inFile, FILENAME, allCourses);
    openFile(inFile, FILENAME); // FIXME: File already opened inside loadSet - redundant second open
    string line;
    while (getline(inFile, line)) {
        Course newCourse;
        string prereq;
        stringstream courseInfo(line); // FIXME: repeated open
        getline(courseInfo, newCourse.courseCode, ',');
        getline(courseInfo, newCourse.courseName, ',');
        // Extract all remaining comma-separated values as prerequisites
        while (getline(courseInfo, prereq, ',')) {
            if (!prereq.empty() && !isspace(prereq[0])) {
                newCourse.preReq.push_back(prereq);
            }
        }
        if (!validateCourse(newCourse)) {
            inFile.close();
            return;
        }
        if (!validatePrereq(allCourses, newCourse)) {
            inFile.close();
            return;
        }
        copyToVector(courses, newCourse);
    }
    cout << FILENAME << " is loaded into Data structure" << endl;
    cout << endl;
    inFile.close();
}

// Partitions vector around a pivot for use in quicksort - returns the end index
int partition(vector<Course>& courses, int low, int high) {
    int begin = low;
    int end = high;
    int mid = low + (high - low) / 2;
    string pivot = courses[mid].courseCode;
    bool done = false;
    // Move begin forward while courseCode is less than pivot
    while (!done) {
        while (courses[begin].courseCode < pivot) {
            begin++;
        }
        // Move end backward while courseCode is greater than pivot
        while (pivot < courses[end].courseCode) {
            end--;
        }
        if (begin >= end) {
            done = true;
        }
        else {
            swap(courses[begin], courses[end]);
            begin++;
            end--;
        }
    }
    return end;
}

// Recursively sorts courses vector by courseCode using quicksort algorithm
// FIXME: spelling in original - 'recurvively' should be 'recursively'
void quickSort(vector<Course>& courses, int low, int high) {
    int midpoint = 0;
    if (low >= high) {
        return;
    }
    midpoint = partition(courses, low, high);
    quickSort(courses, low, midpoint);
    quickSort(courses, midpoint + 1, high);
}

// Sorts and prints all courses with their prerequisites
void printSortedCourses(vector<Course>& courses) {
    // FIXME: Re-sorts vector every time option 2 is selected - inefficient if already sorted
    quickSort(courses, 0, courses.size() - 1);
    for (int i = 0; i < courses.size(); i++) {
        cout << courses[i].courseCode << ": " << courses[i].courseName << " | ";
        for (int j = 0; j < courses[i].preReq.size(); j++) {
            cout << courses[i].preReq[j];
            if (j < courses[i].preReq.size() - 1) {
                cout << ", ";
            }
        }
        cout << endl;
    }
    cout << endl;
}

// Checks if search input matches a valid course code in the set
bool checkIfSearchValid(string& search, set<string>& allCourses) {
    if (allCourses.find(search) == allCourses.end()) {
        cout << "Course doesn't exist in CS program." << endl;
        cout << "List of valid courses" << endl;
        // Print all valid course codes for user reference
        for (const auto& course : allCourses) {
            cout << course << endl;
        }
        cout << endl;
        return false;
    }
    return true;
}

// Searches vector for matching course code and prints course info and prerequisites
void searchFor(vector<Course>& courses, set<string>& allCourses, string& search) {
    for (int i = 0; i < courses.size(); i++) {
        if (search == courses[i].courseCode) {
            cout << courses[i].courseCode << ": " << courses[i].courseName << endl;
            if (courses[i].preReq.size() > 0) {
                cout << "Prerequisites: "; // FIXME: spelling in original - 'Prerequistes' should be 'Prerequisites'
            }
            for (int j = 0; j < courses[i].preReq.size(); j++) {
                cout << courses[i].preReq[j];
                if (j < courses[i].preReq.size() - 1) {
                    cout << ", ";
                }
            }
            cout << endl;
            break;
        }
    }
}

// Prints the main menu with border and options
void printMenu() {
    const int BORDER_LENGTH = 35;
    const char BORDER_CHAR = '*';
    const string MENU_NAME = "Welcome to ABCU CS Course Planner";
    string border(BORDER_LENGTH, BORDER_CHAR);
    cout << border << endl;
    cout << setw(BORDER_LENGTH - static_cast<int>(MENU_NAME.size()) / 2) << MENU_NAME << endl;
    cout << border << endl;
    cout << "Press 1 To load csv file" << endl;
    cout << "Press 2 Sort and print courses" << endl;
    cout << "Press 3 To search for a course" << endl;
    cout << "Press 9 To exit" << endl;
}

// Validates and gets menu selection from user - loops until valid input received
void getUserInput(int& userInput) {
    cin.exceptions(ios::failbit | ios::badbit);
    cout << "Enter your selection: ";
    do {
        try {
            // FIXME: BUG - in original, cin >> userInput was outside the try block after closing }
            // This means input exceptions were never caught correctly
            cin >> userInput;
            // FIXME: Magic numbers 1, 3, 9 should be named constants e.g. MENU_MIN, MENU_MAX, EXIT_CODE
            if (userInput < 1 || (userInput > 3 && userInput != 9)) {
                throw out_of_range("Please enter a int between 1 and 3 or 9 to exit");
            }
        }
        catch (ios_base::failure&) {
            cin.clear();
            cin.ignore(100, '\n'); // FIXME: Magic number 100 should be named constant e.g. MAX_IGNORE
            cout << "Please enter an integer: "; // FIXME: spelling in original - 'interger' should be 'integer'
        }
        catch (out_of_range) {
            cin.ignore(100, '\n'); // FIXME: Magic number 100 repeated - use MAX_IGNORE constant
            cout << "Please enter a int between 1 and 3 or 9 to exit: ";
        }
        // FIXME: Magic numbers 1, 3, 9 repeated in while condition - use named constants MENU_MIN, MENU_MAX, EXIT_CODE
    } while (userInput < 1 || (userInput > 3 && userInput != 9));
    cout << endl;
}

// Converts search string to uppercase for case-insensitive matching
// FIXME: Misleading function name - rename to forceUpperCase
void forceCapLock(string& search) {
    for (auto& letters : search) {
        letters = toupper(letters);
    }
}

// Handles menu selection and calls appropriate function
void menuInput(fstream& inFile, const string& FILENAME, int& userInput, string& search, vector<Course>& courses, set<string>& allCourses) {
    switch (userInput) {
        case 1:
            checkReadFile(inFile, FILENAME, allCourses, courses);
            break;
        case 2:
            if (courses.size() < 1) {
                cout << "Enter option 1 to load courses." << endl;
            }
            printSortedCourses(courses);
            break;
        case 3:
            if (courses.size() < 1) {
                cout << "Enter option 1 to load courses." << endl;
            }
            // Loop until user enters a valid course code
            do {
                cout << "Enter a course to search for: ";
                cin >> search;
                forceCapLock(search);
            } while (!checkIfSearchValid(search, allCourses));
            searchFor(courses, allCourses, search);
            break;
        case 9:
            cout << "Exiting Program." << endl;
            break;
        default:
            break;
    }
}
