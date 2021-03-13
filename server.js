const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const promptMessages = {
    viewAllEmployees: "View All Employees",
    viewByDepartment: "View All Employees By Department",
    viewByManager: "View All Employees By Manager",
    addEmployee: "Add An Employee",
    removeEmployee: "Remove An Employee",
    updatedRole: "Update Employee Role",
    updateEmployeeManager: "Update Employee Manager",
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

connection.connect(err => {
    if(err) throw err;
    prompt();
});

function prompt(){
    inquirer.prompt({
        name: "activity",
        type: "list",
        message: "What would you like to do?",
        choices: [
            promptMessages.viewAllEmployees,
            promptMessages.viewByDepartment,
            promptMessages,viewByManager,
            promptMessages.viewAllRoles,
            promptMessages.addEmployee,
            promptMessages.removeEmployee,
            promptMessages.updatedRole,
            promptMessages.updateEmployeeManager,
            promptMessages.exit
        ]
    })
    .then(answer => {
        switch(answer.activity){
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
            case promptMessages.updatedRole:
                updatedRole();
                break;
            case promptMessages.exit:
                connection.end();
                break;
        }
    });
};

function viewAllEmployees (){
    const query = `SELECT emp.id, emp.first_name, emp.last_name, role.title, dept.name AS department, role.salary, CONCAT(mngr.first_name, " ", mngr.last_name) AS manager
    FROM employee emp
    LEFT JOIN employee mngr ON mngr.id = emp.manager_id
    INNER JOIN role ON role.id = emp.role_id
    INNER JOIN department dept ON dept.id = role.department_id
    ORDER BY emp.id`

    connection.query(query, (err,results) => {
        if(err) throw err;
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

    connection.query(query, (err,results) => {
        if(err) throw err;
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

    connection.query(query, (err,results) => {
        if(err) throw err;
        console.table(results);
        prompt();
    });
};

function viewAllRoles(){
    const query = `SELECT role.title, emp.id, emp.first_name, emp.last_name, dept.name AS department
    FROM employee emp
    LEFT JOIN role ON role.id = emp.role_id
    LEFT JOIN department dept ON dept.id = role.department_id
    ORDER BY role.title`

    connection.query(query, (err, results) => {
        if(err) throw err;
        console.table(results);
        prompt();
    });
};

async function addEmployee(){
    const addName = await inquirer.prompt(askName());

    connection.query("SELECT role.id, role.title FROM role ORDER BY role.id", async (err, results) => {
        if(err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: "role",
                type: "list",
                choices: () => results.map(results => results.title),
                message: "What is the role for this employee?"
            }
        ]);
        let roleId;
        for (const row of results){
            if(row.title === role){
                roleId = row.id;
                continue;
            }
        }
        connection.query("SELECT * FROM employee", async(err, results) => {
            if(err) throw err;
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
            if(manager === "none"){
                managerID = null;
            }
            else {
                for(const data of results) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if(data.fullName === manager){
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
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
                    manager_id: parseInt(managerId)
                },
                (err, results) => {
                    if(err) throw err;
                    prompt();
                }
            );
        });
    });
};

function askName() {
    return ([
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
}
