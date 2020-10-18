const inquirer = require('inquirer');
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
});

// use the object you just created to actually connect
connection.connect(function (err) {
    if (err) throw err;
    // runSearch();
})

function startApp() {

    function initialPrompt() {
        console.log("Welcome to Employee Tracker");
        inquirer.prompt([
            {
                type: "list",
                name: "tableChoice",
                message: "Choose a category.",
                choices: [
                    "View Departments",
                    "View Roles",
                    "View Employees",
                    "Add Department",
                    "Add Role",
                    "Add Employee",
                    "Update Employee Role",
                ]
            }
        ]).then(userChoice => {
            switch (userChoice.tableChoice) {
                case "View Employees":
                    viewEmployees();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View Departments":
                    viewDepartments();
                    break;
                case "Add Department":
                    addDept();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;

                default:
                    finishApp();
            }
        });
    }
    //
    function viewEmployees() {
        console.log("Employees are...");
        connection.query(`
        SELECT 
            employee.id, 
            employee.first_name as FirstName, 
            employee.last_name as LastName, 
            employee_role.title as Title, 
            employee_role.salary as Salary 
            FROM employee 
        LEFT JOIN employee_role ON employee.employee_role_id = employee_role.id`,
            function (err, res) {
                if (err) throw err;
                console.table(res);
                initialPrompt();
            });
    }
    function viewRoles() {
        console.log("Roles are...");
        connection.query(`
        SELECT 
            employee_role.id AS ID, 
            employee_role.title AS Title,
            employee_role.salary AS $$$$,
            department.name as Department
         FROM employee_role
         LEFT JOIN department ON employee_role.department_id = department.id`,
            function (err, res) {
                if (err) throw err;
                console.table(res);
                initialPrompt();
            });
    }
    function viewDepartments() {
        console.log("Departments are...");
        connection.query(`select * from department`,
            function (err, res) {
                if (err) throw err;
                console.table(res);
                initialPrompt();
            });
    }
    function addDept() {
        console.log("Adding Dept");
        initialPrompt();
    }
    function addRole() {
        console.log("Adding Role");
        initialPrompt();
    }
    function addEmp() {
        console.log("Adding Employees");
        initialPrompt();
    }
    function updateRole() {
        console.log("Updating Role");
        initialPrompt();
    }
    //
    initialPrompt();
}

startApp();