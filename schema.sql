-- Drops the database if it already exists
DROP DATABASE IF EXISTS employeeTracker_db;

-- Creates the database
CREATE DATABASE employeeTracker_db;

-- Creates table tasks
CREATE TABLE employee(
	id int NOT NULL AUTO_INCREMENT,
    first_name varchar(30) NULL,
    last_name varchar(30) NULL,
    role_id int NULL,
    manager_id int NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role(
	id int NOT NULL AUTO_INCREMENT,
    title varchar(30) NULL,
    salary decimal(10,2) NULL,
    department_id int NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department(
	id int NOT NULL AUTO_INCREMENT,
    name varchar(30) NULL,
    PRIMARY KEY (id)
);

SELECT * FROM employee;

SELECT * FROM role;

SELECT * FROM department