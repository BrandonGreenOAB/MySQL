//require statements

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
      switch (answer.choice.values) {
        case "ADD_DEPARTMENT":
          return console.log("hello");
        case "VIEW_PORT":
          return view();
        case "UPDATE_ROLE":
          return udpateRole();
      }
    });
}
