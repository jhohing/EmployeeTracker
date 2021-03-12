const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const promptMessages = {
    viewAllEmployees: "View All Employees",
    viewByDepartment: "View All Employees By Department",
    viewManager: "View All Employees By Manager",
    addEmployee: "Add An Employee",
    removeEmplyee: "Remove An Employee",
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