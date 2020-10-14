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
        },
        {
          name: "View departments, roles, or employees",
        },
        {
          name: "update emoployee role",
        },
      ],
    })
    .then((answer) => {
      switch (answer.choice) {
        case "Add a department, role, or employee":
          return adding();
        case "View departments, roles, or employees":
          return viewing();
        case "update emoployee role":
          return updating();
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
      choices: ["View departments", "View roles", "View employees"],
    })
    .then((answer) => {
      switch (answer.viewQuery) {
        case "View departments":
          return viewDepartment();
        case "View roles":
          return viewRole();
        case "View employees":
          return viewEmployee();
      }
    });
}
function updating() {
  let updateEmpID = "";
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);

    inquirer
      .prompt({
        type: "input",
        name: "empList",
        message: "please enter the id of the employee to update.",
      })
      .then((answer) => {
        updateEmpID = answer.empList;
        connection.query(
          "SELECT * FROM employee WHERE id = ? ",
          [updateEmpID],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            //query database for roles
            //update the local array to have the roles from the role db
            //push those roles to the choices array
            const roleArr = [];
            connection.query("SELECT * FROM role", function (err, res) {
              res.forEach((element) => {
                roleArr.push(element.title);
              });
              inquirer
                .prompt({
                  type: "list",
                  name: "updateRole",
                  message: "please select a role id for this employee",
                  choices: roleArr,
                })
                .then((answer) => {
                  connection.query(
                    "SELECT * FROM role WHERE title = ?",
                    [answer.updateRole],
                    function (err, res) {
                      if (err) throw err;
                      console.table(res);
                      connection.query(
                        "UPDATE employee SET role_id = ? WHERE id = ?",
                        [res[0].id, updateEmpID],
                        function (err, result) {
                          if (err) throw err;
                          loadPrompts();
                        }
                      );
                    }
                  );
                });
            });
          }
        );
      });
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
        message: "What is the role ID for this employee?(choose 1-10)",
      },
      {
        type: "input",
        name: "empManager",
        message:
          "what is the manager id for this employee?(manager must exist)",
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

function viewDepartment() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    loadPrompts();
  });
}
function viewEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    loadPrompts();
  });
}
function viewRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    loadPrompts();
  });
}
