USE employeeTracker_db;

INSERT INTO department(name)
VALUES 
('Management'),
('Sales'),
('Warehouse'),
('Human Resources'),
('Quality Control'),
('Office Management'),
('Accounting');

INSERT INTO role(title, salary, department_id)
VALUES
('Regional Manager', 105000, 1),
('Sales Rep', 60000, 2),
('HR Rep', 75000, 4),
('Warehouse Worker', 42000, 3),
('Receptionist', 45000, 6),
('Accountant', 95000, 7);

INSERT INTO employee(first_name, last_name, role_id) 
VALUES
('Phil', 'Scott', 1),
('Pam', 'McMullen', 5),
('Kim', 'Lidolf', 2),
('Tom', 'Flenderson', 3),
('Zach', 'Hudson', 6),
('Darryl', 'Jones', 3);

UPDATE `employee` SET `manager_id` = '1' WHERE (`id` > '1');

