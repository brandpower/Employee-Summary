const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { AsyncResource } = require("async_hooks");
const { promisify } = require("util");

let employees = [];

init();


function init() {

    AddEmployees();
}

function AddEmployees() {
    inquirer.prompt(
        [
            {
                type: "confirm",
                message: "Add new employee?",
                name: "confirmAddNewEmployee"
            }
        ])
        .then(function (answers) {
            if (answers.confirmAddNewEmployee === true) {
                promptUserAndAddEmployee();
            } else {
                const htmlRender = render(employees)
                fs.writeFile("./output/team.html", htmlRender, "utf8", (error) => {
                    if (error) {
                        console.log(error);
                    }
                    console.log("Team has been successfully created and is located in the output folder of this application.")
                });
            }
        });
}

function promptUserAndAddEmployee() {
    inquirer.prompt(
        [
            {
                type: "list",
                message: "Select your Role:",
                choices:
                    [
                        "Engineer",
                        "Intern",
                        "Manager"
                    ],
                name: "role"
            },
            {
                type: "input",
                message: "Enter your name:",
                name: "username"
            },
            {
                type: "input",
                message: "Enter your ID number:",
                name: "employeeID"
            },
            {
                type: "input",
                message: "Enter your email:",
                name: "email"
            }
        ]
    )
        .then(function (answers) {
            if (answers.role === "Engineer") {
                inquirer.prompt(
                    [
                        {
                            type: "input",
                            message: "Enter GitHub username:",
                            name: "github"
                        }
                    ])
                    .then(function (answer) {
                        addEmployeeToArrayAndContinue(new Engineer(answers.username, answers.employeeID, answers.email, answer.github));
                    });
            }

            if (answers.role === "Intern") {
                inquirer.prompt([{
                    type: "input",
                    message: "Enter School Name:",
                    name: "schoolName"
                }])
                    .then(function (answer) {
                        addEmployeeToArrayAndContinue(new Intern(answers.username, answers.employeeID, answers.email, answer.schoolName));
                    });
            }

            if (answers.role === "Manager") {
                inquirer.prompt([{
                    type: "input",
                    message: "Enter Office Number:",
                    name: "officeNumber"
                }])
                    .then(function (answer) {
                        addEmployeeToArrayAndContinue(new Manager(answers.username, answers.employeeID, answers.email, answer.officeNumber));
                    });
            }
        });
}

function addEmployeeToArrayAndContinue(newEmployee) {
    if (newEmployee !== null) {
        employees.push(newEmployee);
    }
    AddEmployees();
}