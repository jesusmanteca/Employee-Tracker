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
    console.log(
        `
        OoOoOoOo
        OoOoOoOoOoOoOoOo
        OoOoOoOoOoOoOoOoOoOoOoOo
        OoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOo
        OoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOo

        Welcome to Employee Tracker

        OoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOo
        OoOoOoOoOoOoOoOoOoOoOoOoOoOoOoOo
        OoOoOoOoOoOoOoOoOoOoOoOo
        OoOoOoOoOoOoOoOo
        OoOoOoOo
        
        `);

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
            employee.id AS ID, 
            employee.first_name as FirstName, 
            employee.last_name as LastName, 
            employee_role.title as Title, 
            employee_role.salary as Salary,
            department.name as Department
        FROM employee 
        LEFT JOIN employee_role ON employee.employee_role_id = employee_role.id
        LEFT JOIN department ON employee_role.department_id = department.id`,
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
        return inquirer.prompt([
            {
                type: "input",
                name: "deptChoice",
                message: "Enter a Department Name",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter at least one character.";
                }
            }
        ]).then(answer => {
            const department = answer.deptChoice

            console.log("Adding Dept");
            const sql = `
                INSERT INTO department (name)
                VALUES (?)
                `
            const param = [department]
            connection.query(sql, param, function (err, result) {
                if (err) {
                    console.log(err);
                }
                console.log(`
                !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                !!!Department Added Successfully!!!
                !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                `);
                initialPrompt();
            })
        })


    }
    function addRole() {
        console.log("Adding Role!!");
        return inquirer.prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "Enter a Role Title",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter role title.";
                }
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Enter a salary for this role",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter role salary amount.";
                }
            },
            {
                type: "list",
                name: "roleDept",
                message: "Enter a department for this role",
                choices: [
                    "Creative",
                    "Strategy",
                    "Human Resources",
                    "Administration",
                    "Digital",
                    "Accounting",
                    "Sales",
                ]
            }
        ]).then(answer => {
            const roleTitle = answer.roleTitle;
            const roleSalary = answer.roleSalary;
            const roleDept = answer.roleDept;
            var deptNumber = roleDept

            if (deptNumber = "Accounting"){
                deptNumber = 1
            } else if (deptNumber = "Creative"){
                deptNumber = 2
            } else if (deptNumber = "Strategy"){
                deptNumber = 3
            } else if (deptNumber = "Human Resources"){
                deptNumber = 4
            } else if (deptNumber = "Administration"){
                deptNumber = 5
            } else if (deptNumber = "Sales"){
                deptNumber = 6
            } else if (deptNumber = "Digital"){
                deptNumber = 7
            } 

            console.log("Adding role")
            const sql = `
            INSERT INTO employee_role (title, salary, department_id)
            VALUES (?,?,?)
            `
            const param = [roleTitle, roleSalary, deptNumber];
            connection.query(sql, param, function (err, result) {
                if (err) {
                    console.log(err);
                }
                console.log(`
                !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                !!!Role Added Successfully!!!
                !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                `);
                initialPrompt();
            });
        });

    }
    function addEmp() {
        console.log("Adding Employees");

        return inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "Enter employee first name",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter role title.";
                }
            },
            {
                type: "input",
                name: "lastName",
                message: "Enter employee last name",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter role title.";
                }
            },
            {
                type: "list",
                name: "employeeRole",
                message: "Enter a role for this employee",
                choices: [
                    "Sr. Accounting",
                    "Jr. Accounting",
                    "Copywriter",
                    "Associate Creative Director",
                    "Sr. Copywriter",
                    "Creative Director",
                    "Sr. Creative Director",
                    "Jr. Planner",
                    "Jr. Recruiter",
                    "Associate Planner",
                    "Sr. Planner",
                    "Jr. Recruiter",
                    "Sr. Recruiter",
                    "Director of Human Resources",
                    "VP Human Resources",
                    "Administrative Assistant",
                    "Administrative Director",
                    "Junior Sales",
                    "Associate Sales",
                    "VP Sales",
                    "EVP Sales",
                    "Jr. Web Developer",
                    "Associate Web Developer",
                    "Sr. Web Developer",
                    "VP Digital",
                ]
            }
        ]).then(answer => {
            const firstName = answer.firstName;
            const lastName = answer.lastName;
            const employeeRole = answer.employeeRole;
            var roleDeptName = employeeRole

            if (roleDeptName = "Sr. Accounting"){
                roleDeptName = 1
            } else if (roleDeptName = "Jr. Accounting"){
                roleDeptName = 2
            } else if (roleDeptName = "Copywriter"){
                roleDeptName = 3
            } else if (roleDeptName = "Associate Creative Director"){
                roleDeptName = 4
            } else if (roleDeptName = "Sr. Copywriter"){
                roleDeptName = 5
            } else if (roleDeptName = "Creative Director"){
                roleDeptName = 6
            } else if (roleDeptName = "Sr. Creative Director"){
                roleDeptName = 7
            } else if (roleDeptName = "Jr. Planner"){
                roleDeptName = 8
            } else if (roleDeptName = "Associate Planner"){
                roleDeptName = 9
            } else if (roleDeptName = "Sr. Planner"){
                roleDeptName = 10
            } else if (roleDeptName = "Jr. Recruiter"){
                roleDeptName = 11
            } else if (roleDeptName = "Sr. Recruiter"){
                roleDeptName = 12
            } else if (roleDeptName = "Director of Human Resources"){
                roleDeptName = 13
            } else if (roleDeptName = "VP Human Resources"){
                roleDeptName = 14
            } else if (roleDeptName = "Administrative Assistant"){
                roleDeptName = 15
            } else if (roleDeptName = "Administrative Director"){
                roleDeptName = 16
            } else if (roleDeptName = "Junior Sales"){
                roleDeptName = 17
            } else if (roleDeptName = "Associate Sales"){
                roleDeptName = 18
            } else if (roleDeptName = "VP Sales"){
                roleDeptName = 19
            } else if (roleDeptName = "EVP Sales"){
                roleDeptName = 20
            } else if (roleDeptName = "Jr. Web Developer"){
                roleDeptName = 21
            } else if (roleDeptName = "Associate Web Developer"){
                roleDeptName = 22
            } else if (roleDeptName = "Sr. Web Developer"){
                roleDeptName = 23
            } else if (roleDeptName = "VP Digital"){
                roleDeptName = 24
            }

            console.log("Adding Employee")
            const sql = `
            INSERT INTO employee (first_name, last_name, employee_role_id)
            VALUES (?, ?, ?)
            `
            const param = [firstName, lastName, roleDeptName];
            connection.query(sql, param, function (err, result) {
                if (err) {
                    console.log(err);
                }
                console.log(`
                !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                !!!!Employee Added Successfully!!!!
                !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                `);

            });
            initialPrompt();
        });
    }
    function updateRole() {
        console.log("Updating Role");
        initialPrompt();
    }
    //
    initialPrompt();
}

startApp();