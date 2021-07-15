// This is calling lib
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "assets");
const outputPath = path.join(OUTPUT_DIR, "My-Team-Profile.html");

const render = require("./lib/htmlTemplate");

const team = [];

// This is the Manager Prompt 
const addManager = () => {
    return new Promise((res) => {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter Manager's name:",
                    name: "name",
                },

                {
                    type: "input",
                    message: "Enter Manager's ID:",
                    name: "id",
                },

                {
                    type: "input",
                    message: "Enter Manager's Email:",
                    name: "email",

                    // This is the function to check the validator email 
                    default: () => {},
                    validate: function (email) {
                    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                     if (valid) {
                    return true;
                    } else {
                    console.log(" ---Please Enter a Valid Email!---")
                    return false;
                    }
                  }  
                },

                {
                    type: "input",
                    message: "Enter Manager's Office Number:",
                    name: "officeNumber",
                },

            // This is the function to add created manager's info into team array     
            ]).then(answers => {
                const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
                team.push(manager);
                res();
            });
    });
}

// This is the prompt for adding Engineer or Intern input
const addEmployee = () => {
    return new Promise((resolve) => {
        inquirer.prompt([
            {
                type: "list",
                message: "Select The Employee You Would Like to Add:",
                name: "role",
                choices: [
                    "Engineer",
                    "Intern",
                    {
                        name: "No More Employees to Add",
                        value: false
                    }
                ]
            },

            {
                message: "Enter Engineer's Name:",
                name: "name",
                when: ({ role }) => role === "Engineer"
            },

            {
                message: "Enter Intern's name:",
                name: "name",
                when: ({ role }) => role === "Intern"
            },

            {
                message: "Enter Engineer's ID:",
                name: "id",
                when: ({ role }) => role === "Engineer"
            },

            {
                message: "Enter Intern's ID:",
                name: "id",
                when: ({ role }) => role === "Intern"
            },

            {
                message: "Enter Engineer's Email Address:",
                name: "email",
                // This is the email validator
                default: () => {},
                    validate: function (email) {
                    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                     if (valid) {
                    return true;
                    } else {
                    console.log(" ---Please Enter a Valid Email!---")
                    return false;
                    }
                  },  
                when: ({ role }) => role === "Engineer"
            },

            {
                message: "Enter Intern's Email Address:",
                name: "email",
                // This is the email validator
                default: () => {},
                    validate: function (email) {
                    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                     if (valid) {
                    return true;
                    } else {
                    console.log(" ---Please Enter a Valid Email!---")
                    return false;
                    }
                  }, 
                when: ({ role }) => role === "Intern"
            },

            {
                message: "Enter engineer's GitHub Username:",
                name: "github",
                when: ({ role }) => role === "Engineer"
            },

            {
                message: "Enter Intern's School Name:",
                name: "school",
                when: ({ role }) => role === "Intern"
            }
        
        // This is the function to add created Engineer/Intern info into team array     
        ]).then(answers => {
            if (answers.role) {
                switch (answers.role) {
                    case "Engineer":
                        const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                        team.push(engineer);
                        break;
                    case "Intern":
                        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
                        team.push(intern);
                        break;
                }
                return addEmployee().then(() => resolve());
            } else {
                return resolve();
            }
        })
    })
}

// This is calling Manager's and employee's prompt functions
addManager().then(() => {
    return addEmployee();

// This is calling render function to export team array information into html template   
}).then(() => {
    const templateHTML = render(team)
    generatePage(templateHTML);
}).catch((err) => {
    console.log(err);
});

// This is the function to generate html page in output folder
const generatePage = (htmlPage) => {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, htmlPage, "utf-8", (err) => {
        if(err) throw err;
        console.log("Team Profile Page Generated!");
    });
}