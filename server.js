const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { async } = require("rxjs");

const promptMessages = {
    viewAllEmployees: "View All Employees",
    viewByDepartment: "View All Employees By Department",
    viewByManager: "View All Employees By Manager",
    addEmployee: "Add An Employee",
    addDept: "Add Department",
    addRole: "Add Role",
    removeEmployee: "Remove An Employee",
    removeDept: "Remove Department",
    removeRole: "Remove Role",
    updateRole: "Update Employee Role",
    viewAllRoles: "View All Roles",
    exit: "Exit"
};

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "JnhCmk102123",
    database: "employeeTracker_db"
});

function prompt() {
    inquirer.prompt({
        name: "activity",
        type: "list",
        message: "What would you like to do?",
        choices: [
            promptMessages.viewAllEmployees,
            promptMessages.viewByDepartment,
            promptMessages.viewByManager,
            promptMessages.viewAllRoles,
            promptMessages.addEmployee,
            promptMessages.addDept,
            promptMessages.addRole,
            promptMessages.removeEmployee,
            promptMessages.removeDept,
            promptMessages.removeRole,
            promptMessages.updateRole,
            promptMessages.exit
        ]
    })
        .then(answer => {
            switch (answer.activity) {
                case promptMessages.viewAllEmployees:
                    viewAllEmployees();
                    break;
                case promptMessages.viewByDepartment:
                    viewByDepartment();
                    break;
                case promptMessages.viewByManager:
                    viewByManager();
                    break
                case promptMessages.viewAllRoles:
                    viewAllRoles();
                    break;
                case promptMessages.addEmployee:
                    addEmployee();
                    break;
                case promptMessages.removeEmployee:
                    removeEmployee();
                    break;
                case promptMessages.updateRole:
                    updateRole();
                    break;
                case promptMessages.removeDept:
                    removeDept();
                    break;
                case promptMessages.removeRole:
                    removeRole();
                    break;
                case promptMessages.addDept:
                    addDept();
                    break;
                case promptMessages.addRole:
                    addRole();
                    break;
                case promptMessages.exit:
                    connection.end();
                    break;
            }
        });
};

function viewAllEmployees() {
    const query = `SELECT emp.id, emp.first_name, emp.last_name, role.title, dept.name AS department, role.salary, CONCAT(mngr.first_name, " ", mngr.last_name) AS manager
    FROM employee emp
    LEFT JOIN employee mngr ON mngr.id = emp.manager_id
    INNER JOIN role ON role.id = emp.role_id
    INNER JOIN department dept ON dept.id = role.department_id
    ORDER BY emp.id`

    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        prompt();
    });
};

function viewByDepartment() {
    const query = `SELECT dept.name AS department, role.title, emp.id, emp.first_name, emp.last_name
    FROM employee emp
    LEFT JOIN role ON role.id = emp.role_id
    LEFT JOIN department dept ON dept.id = role.department_id
    ORDER BY department`

    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        prompt();
    })
};

function viewByManager() {
    const query = `SELECT CONCAT(mngr.first_name, " ", mngr.last_name) AS manager, dept.name AS department, emp.id, emp.first_name, emp.last_name, role.title
    FROM employee emp
    LEFT JOIN employee mngr ON mngr.id = emp.manager_id
    INNER JOIN role ON role.id = emp.role_id
    INNER JOIN department dept ON dept.id = role.department_id
    ORDER BY manager`

    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        prompt();
    });
};

function viewAllRoles() {
    const query = `SELECT role.title, emp.id, emp.first_name, emp.last_name, dept.name AS department
    FROM employee emp
    LEFT JOIN role ON role.id = emp.role_id
    LEFT JOIN department dept ON dept.id = role.department_id
    ORDER BY role.title`

    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        prompt();
    });
};

async function addEmployee() {
    const addName = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);

    connection.query("SELECT role.id, role.title FROM role ORDER BY role.id", async (err, results) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: "role",
                type: "list",
                choices: () => results.map(results => results.title),
                message: "What is the role for this employee?"
            }
        ]);
        let roleId;
        for (const row of results) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query("SELECT * FROM employee", async (err, results) => {
            if (err) throw err;
            let choices = results.map(results => `${results.first_name} ${results.last_name}`);
            choices.push("none");
            let { manager } = await inquirer.prompt([
                {
                    name: "manager",
                    type: "list",
                    choices: choices,
                    message: "Choose the manager for this employee: "
                }
            ]);
            let managerID;
            let managerName;
            if (manager === "none") {
                managerID = null;
            }
            else {
                for (const data of results) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerID);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log("Employee has been added.");
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: addName.first,
                    last_name: addName.last,
                    role_id: roleId,
                    manager_id: managerID
                },
                (err, results) => {
                    if (err) throw err;
                    prompt();
                }
            );
        });
    });
};

async function addDept() {
    const dept = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the department?"
        }
    ]);

    connection.query("INSERT INTO department SET ?", { name: dept.name }, (err, results) => {
        if(err) throw err;
        prompt();
    });
};

async function addRole() {
    const role = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name: "dept",
            type: "input",
            message: "What department (id) is this role under?"
        }
    ]);

    connection.query("INSERT INTO role SET ?", 
        { title: role.name, salary: role.salary, department_id: role.dept }, (err, results) => {
            if(err) throw err;
            prompt();
    });
};

async function removeEmployee() {
    const answer = await inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the ID of the employee you would like to remove: "
        }
    ]);

    connection.query("DELETE FROM employee WHERE ?", { id: answer.id }, function (err) {
        if (err) throw err;
    })
    console.log("Employee has been removed from the the system");
    prompt();
};

async function removeDept() {
    const answer = await inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the ID of the department you would like to remove: "
        }
    ]);

    connection.query("DELETE FROM department WHERE ?", { id: answer.id }, function (err) {
        if (err) throw err;
    })
    console.log("Department has been removed from the the system");
    prompt();
};

async function removeRole() {
    const answer = await inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the ID of the role you would like to remove: "
        }
    ]);

    connection.query("DELETE FROM role WHERE ?", { id: answer.id }, function (err) {
        if (err) throw err;
    })
    console.log("Role has been removed from the the system");
    prompt();
};

async function updateRole() {
    const employeeID = await inquirer.prompt([
        {
            name: "empID",
            type: "input",
            message: "Please enter the ID of the employee you want to update: "
        }
    ]);

    connection.query("SELECT role.id, role.title FROM role ORDER BY role.id", async (err, results) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: "role",
                type: "list",
                choices: () => results.map(results => results.title),
                message: "What is the new role for this employee?"
            }
        ]);
        let roleID;
        for (const row of results) {
            if (row.title === role) {
                roleID = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee SET role_id = ${roleID} WHERE employee.id = ${employeeID.empID}`, async (err, results) => {
            if (err) throw err;
            console.log("Role has been updated!");
            prompt();
        });
    });
};

prompt();
