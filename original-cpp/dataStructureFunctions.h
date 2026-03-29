//  Project 2 functions header file
//  Created by Jermaine Wiggins on 2/23/25.


#ifndef dataStructureFunctions_h
#define dataStructureFunctions_h

#include <iostream>
#include <cctype>
#include <vector>
#include <fstream>
#include <string>
#include <sstream>
#include <set>
#include <stdexcept>


using namespace std;

// object to hold course info
struct Course {
    string courseCode = "";
    string courseName = "";
    vector <string> preReq;
};

// Function prototypes

// opens file and load course info into set
void openFile(fstream& inFile, const string& FILENAME);
void loadSet (fstream& inFile, const string& FILENAME, set<string>& allCourses);

// validate course file returna true if course name valid and prereqs a valid course in file
bool validateCourse(const Course& newCourse);
bool validatePrereq(const set<string>& allCourses, Course& newCourse);

// copies course object to data structure and reads file
void copyToVector(vector<Course>& courses, Course& newCourse);
void checkReadFile(fstream& inFile, const string& FILENAME, set<string>& allCourses, vector<Course>& courses);

// fucntion to sort vector
int partition(vector<Course>& courses, int low, int high);
void quickSort(vector<Course>& courses, int low, int high);

// print sorted courses
void printSortedCourses(vector<Course>& courses);

// checks if user input is a valid search
bool checkIfSearchValid(string& search, set<string>& allCourses);
void searchFor(vector<Course>& courses, set<string>& allCourses, string& search);

// menu
void printMenu();

// user input
void getUserInput(int& userInput);
void forceCapLock(string& search);
void menuInput(fstream& inFile, const string& FILENAME, int& userInput, string& search, vector<Course>& Courses, set<string>& allCourses);

#endif /* dataStructureFunctions_h */
