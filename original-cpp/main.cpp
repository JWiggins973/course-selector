// FIXME: Add purpose description to file header - just says "Project 2" which is unclear
// Program that reads a csv file and loads into data structure
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

// main
int main(int argc, const char* argv[]) {

    const string FILENAME = "SNHU.csv"; // csv file
    vector<Course> courses;             // struct to hold all course info from csv
    set<string> allCourses;             // used to validate if prereqs are valid
    fstream inFile;                     // read file
    int userInput = 0;                  // get user input for menu
    string search = "";                 // FIXME: comment says "user input to" - incomplete comment, finish it

    do {
        printMenu();
        getUserInput(userInput);
        menuInput(inFile, FILENAME, userInput, search, courses, allCourses);

    } while (userInput != 9); // FIXME: Magic number 9 should be a named constant e.g. EXIT_CODE

    return 0;
}
