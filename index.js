const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employees",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n/");
  init();
});

function init() {
  const logoText = logo({ name: "employee manager" }).render();
  console.log(logoText);

  //load our prompts
  loadPrompts();
}

function loadPrompts() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "what would you like to do?",
      choices: [
        {
          name: "Add a department, role, or employee",
          values: "ADD_DEPARTMENT",
        },
        {
          name: "View a department, role or employee",
          values: "VIEW_PORT",
        },
        {
          name: "update emoployee role",
          values: "UPDATE_ROLE",
        },
      ],
    })
    .then((answer) => {
      switch (answer.choice) {
        case "Add a department, role, or employee":
          return adding();
        case "View a department, role or employee":
          return viewing();
        case "update emoployee role":
          return console.log("update");
      }
    });
}

function adding() {
  inquirer
    .prompt({
      type: "list",
      name: "addQuery",
      message: "Please select what you want to add",
      choices: ["Add a department", "Add a role", "Add an employee"],
    })
    .then((answer) => {
      switch (answer.addQuery) {
        case "Add a department":
          return addDepartment();
        case "Add a role":
          return addRole();
        case "Add an employee":
          return addEmployee();
      }
    });
}
function viewing() {
  inquirer
    .prompt({
      type: "list",
      name: "viewQuery",
      message: "Please select what you would like to view.",
      choices: ["View a department", "View a role", "View an employee"],
    })
    .then((answer) => {
      switch (answer.addQuery) {
        case "View a department":
          return viewDepartment();
        case "View a role":
          return viewRole();
        case "View an employee":
          return viewEmployee();
      }
    });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "addDept",
      message: "Enter the name of the department you'd like to add.",
    })
    .then((answer) => {
      connection.query(
        `INSERT INTO department SET ?`,
        { name: answer.addDept },
        (err) => {
          if (err) throw err;
        }
      );
      console.log("Adding Department...");
      loadPrompts();
    });
}
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addRole",
        message: "Enter the name of the role you'd like to add.",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of this postion?",
      },
      {
        type: "input",
        name: "roleID",
        message: "What is the department ID for this role?",
      },
    ])
    .then((answer) => {
      connection.query(
        `INSERT INTO role SET ?`,
        {
          title: answer.addRole,
          salary: answer.roleSalary,
          department_id: answer.roleID,
        },
        (err) => {
          if (err) throw err;
        }
      );
      console.log("Adding A Role...");
      loadPrompts();
    });
}
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fnEmployee",
        message: "Enter the first name of the employee you'd like to add.",
      },
      {
        type: "input",
        name: "lnEmployee",
        message: "What is the last name of the employee?",
      },
      {
        type: "input",
        name: "deptID",
        message: "What is the department ID for this employee?",
      },
      {
        type: "input",
        name: "empManager",
        message: "what is the manager id for this employee?",
      },
    ])
    .then((answer) => {
      connection.query(
        `INSERT INTO employee SET ?`,
        {
          first_name: answer.fnEmployee,
          last_name: answer.lnEmployee,
          role_id: answer.deptID,
          manager_id: answer.empManager,
        },
        (err) => {
          if (err) throw err;
        }
      );
      console.log("Adding an Employee...");
      loadPrompts();
    });
}
